import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  merchantTransactionId: {
    type: String,
    required: true,
    unique: true
  },
  merchantUserId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  phonepeTransactionId: {
    type: String,
    default: null
  },
  paymentInstrument: {
    type: Object,
    default: null
  },
  responseCode: {
    type: String,
    default: null
  },
  responseMessage: {
    type: String,
    default: null
  },
  redirectUrl: {
    type: String,
    default: null
  },
  callbackData: {
    type: Object,
    default: null
  },
  redirectData: {
    type: Object,
    default: null
  }
}, {
  timestamps: true
});

const Payment = mongoose.model("payments", PaymentSchema);
export default Payment;

