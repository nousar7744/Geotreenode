import axios from "axios";
import crypto from "crypto";
import Payment from "../Models/payment.model.js";

const BASE_URL = process.env.PHONEPE_BASE_URL || "https://api.phonepe.com/apis/hermes";
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'M22T3LSJZZPHD';
const SALT_KEY = process.env.PHONEPE_SALT_KEY || 'bd66a1c4-734d-49d7-8133-0d76d19462ac';
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';
const APP_BASE_URL = process.env.APP_BASE_URL || "https://adminst.geotree.xyz";

// const BASE_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox"; // sandbox
// const MERCHANT_ID = 'PGTESTPAYUAT86';
// const SALT_KEY = '96434309-7796-489d-8924-ab56988a6076';
// const SALT_INDEX = '1';
// const redirectUrl = "https://webhook.site/redirect-url";
// const callbackUrl = "https://webhook.site/redirect-url";

function createChecksum(payloadBase64, apiPath) {
  const stringToSign = payloadBase64 + apiPath + SALT_KEY;
  const hash = crypto.createHash("sha256").update(stringToSign).digest("hex");
  return `${hash}###${SALT_INDEX}`;
}

function verifyChecksum(payloadBase64, checksum, apiPath) {
  const expectedChecksum = createChecksum(payloadBase64, apiPath);
  return expectedChecksum === checksum;
}

// ✅ EXPRESS CONTROLLER
export const createPhonePePayment = async (req, res) => {
  try {
    const { amount, mobile } = req.body;

    if (!amount || !mobile) {
      return res.status(400).json({
        success: false,
        message: "amount and mobile are required",
      });
    }

    const merchantTransactionId = `TXN_${Date.now()}`;

    const payload = {
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: mobile,
      amount: Number(amount) * 100,
      redirectUrl: `${APP_BASE_URL}/phonepe/redirect`,
      redirectMode: "POST",
      callbackUrl: `${APP_BASE_URL}/phonepe/callback`,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
  
    };

    const payloadBase64 = Buffer
      .from(JSON.stringify(payload))
      .toString("base64");

    const apiPath = "/pg/v1/pay";
    const checksum = createChecksum(payloadBase64, apiPath);

    // Debug logging
    console.log("📤 PhonePe Payment Request:");
    console.log("URL:", BASE_URL + apiPath);
    console.log("Redirect URL:", `${APP_BASE_URL}/phonepe/redirect`);
    console.log("Callback URL:", `${APP_BASE_URL}/phonepe/callback`);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post(
      BASE_URL + apiPath,
      { request: payloadBase64 },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": MERCHANT_ID,
        },
      }
    );

    // Save payment transaction to database
    const payment = await Payment.create({
      merchantTransactionId,
      merchantUserId: mobile,
      amount: Number(amount) * 100,
      status: 'PENDING',
      redirectUrl: `${APP_BASE_URL}/phonepe/redirect`,
      paymentInstrument: response.data?.data?.instrumentResponse?.redirectInfo
    });

    return res.json({
      success: true,
      base64Payload: payloadBase64,
      checksum,
      data: response.data?.data,
      transactionId: merchantTransactionId,
      paymentId: payment._id,
      redirectUrl: response.data?.data?.instrumentResponse?.redirectInfo?.redirectUrl,
      callbackUrl: response.data?.data?.instrumentResponse?.redirectInfo?.callbackUrl,
    });

  } catch (error) {
    // Detailed error logging
    console.error("❌ PhonePe Error:");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Error Data:", JSON.stringify(error.response?.data, null, 2));
    console.error("Error Message:", error.message);
    console.error("Request URL:", error.config?.url);
    console.error("Request Headers:", error.config?.headers);
    
    // Return detailed error information
    const statusCode = error.response?.status || 500;
    const phonePeError = error.response?.data;
    
    // Extract error message from PhonePe response
    let errorMessage = "Request failed with status code " + statusCode;
    if (phonePeError) {
      if (phonePeError.message) {
        errorMessage = phonePeError.message;
      } else if (phonePeError.code) {
        errorMessage = phonePeError.code;
      } else if (typeof phonePeError === 'string') {
        errorMessage = phonePeError;
      } else if (phonePeError.error) {
        errorMessage = phonePeError.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: phonePeError || error.message,
      statusCode: statusCode
    });
  }
};

// PhonePe Redirect Handler
export const phonePeRedirect = async (req, res) => {
  try {
    console.log("📥 PhonePe Redirect:", req.body);
    
    const { response, checksum } = req.body;
    
    if (!response || !checksum) {
      return res.status(400).json({
        success: false,
        message: "Invalid redirect data"
      });
    }

    // Verify checksum
    const apiPath = "/pg/v1/pay";
    const isValid = verifyChecksum(response, checksum, apiPath);
    
    if (!isValid) {
      console.error("❌ Invalid checksum in redirect");
      return res.status(400).json({
        success: false,
        message: "Invalid checksum"
      });
    }

    // Decode response
    const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString());
    const { merchantTransactionId, transactionId, code, state } = decodedResponse;

    // Update payment status
    const payment = await Payment.findOneAndUpdate(
      { merchantTransactionId },
      {
        status: code === 'PAYMENT_SUCCESS' ? 'SUCCESS' : code === 'PAYMENT_ERROR' ? 'FAILED' : 'CANCELLED',
        phonepeTransactionId: transactionId,
        responseCode: code,
        responseMessage: state,
        redirectData: decodedResponse
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment transaction not found"
      });
    }

    return res.json({
      success: true,
      message: "Redirect processed successfully",
      payment: {
        transactionId: payment.merchantTransactionId,
        status: payment.status,
        amount: payment.amount
      }
    });
  } catch (error) {
    console.error("Redirect Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// PhonePe Callback Handler
export const phonePeCallback = async (req, res) => {
  try {
    console.log("📥 PhonePe Callback:", req.body);
    
    const { response, checksum } = req.body;
    
    if (!response || !checksum) {
      return res.status(400).json({
        success: false,
        message: "Invalid callback data"
      });
    }

    // Verify checksum
    const apiPath = "/pg/v1/pay";
    const isValid = verifyChecksum(response, checksum, apiPath);
    
    if (!isValid) {
      console.error("❌ Invalid checksum in callback");
      return res.status(400).json({
        success: false,
        message: "Invalid checksum"
      });
    }

    // Decode response
    const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString());
    const { merchantTransactionId, transactionId, code, state } = decodedResponse;

    // Update payment status
    const payment = await Payment.findOneAndUpdate(
      { merchantTransactionId },
      {
        status: code === 'PAYMENT_SUCCESS' ? 'SUCCESS' : code === 'PAYMENT_ERROR' ? 'FAILED' : 'CANCELLED',
        phonepeTransactionId: transactionId,
        responseCode: code,
        responseMessage: state,
        callbackData: decodedResponse
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment transaction not found"
      });
    }

    // Update user amount if payment successful
    if (payment.status === 'SUCCESS') {
      const myUser = (await import("../Models/user.model.js")).default;
      await myUser.findOneAndUpdate(
        { mobile: payment.merchantUserId },
        { $inc: { amount: payment.amount / 100 } }
      );
    }

    // Return success immediately (PhonePe expects quick response)
    return res.status(200).json({
      success: true,
      message: "Callback processed"
    });
  } catch (error) {
    console.error("Callback Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Check Payment Status
export const checkPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required"
      });
    }

    // Find payment in database
    const payment = await Payment.findOne({ merchantTransactionId: transactionId });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment transaction not found"
      });
    }

    // If payment is still pending, verify with PhonePe
    if (payment.status === 'PENDING') {
      try {
        const apiPath = `/pg/v1/status/${MERCHANT_ID}/${transactionId}`;
        const checksum = createChecksum('', apiPath);

        const response = await axios.get(BASE_URL + apiPath, {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
            "X-MERCHANT-ID": MERCHANT_ID,
          },
        });

        const statusData = response.data?.data;
        if (statusData) {
          const status = statusData.state === 'COMPLETED' ? 'SUCCESS' : 
                        statusData.state === 'FAILED' ? 'FAILED' : 'PENDING';
          
          await Payment.findOneAndUpdate(
            { merchantTransactionId: transactionId },
            {
              status,
              phonepeTransactionId: statusData.transactionId,
              responseCode: statusData.code,
              responseMessage: statusData.state
            }
          );

          payment.status = status;
        }
      } catch (error) {
        console.error("Status check error:", error.message);
      }
    }

    return res.json({
      success: true,
      payment: {
        transactionId: payment.merchantTransactionId,
        phonepeTransactionId: payment.phonepeTransactionId,
        amount: payment.amount / 100,
        status: payment.status,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt
      }
    });
  } catch (error) {
    console.error("Check Payment Status Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
