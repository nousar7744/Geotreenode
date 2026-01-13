import myUser from "../Models/user.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from 'otp-generator'
import crypto from "crypto";
import axios from "axios";

export const Checkuser = async (req, res) => {
  try {
    const { mobile, device_token } = req.body;

    if (!mobile) {
      return res.status(400).json({
        status: false,
        message: "Mobile is required",
        data: {},
      });
    }

    const existingUser = await myUser.findOne({ mobile });
   console.log('existingUser', existingUser);
    // 🔁 Mobile already exists → resend OTP
    if (existingUser) {
      const updatedUser = await myUser.findByIdAndUpdate(
        existingUser._id,
        {
      $unset: { otp: "" },          // ✅ remove otp field
      $set: { number_verified: true } // optional
    },
        { new: true }

    );

      return res.json({
        status: true,
         message: 'Mobile already registered',
        data:updatedUser,
      });
    }

    // 🚫 Device already used by another user
    if (device_token) {
      const deviceUser = await myUser.findOne({ device_token });
      if (deviceUser && deviceUser.mobile !== mobile) {
        return res.json({
          status: false,
          message: "Device already registered with another account",
          data: {},
        });
      }
    }

    // 🆕 New user
    const otp = Math.floor(1000 + Math.random() * 9000);

    const newUser = await myUser.create({
      mobile,
      device_token,
      otp,
      mobile_verified: false,   // ✅ ALWAYS FALSE HERE
    });

    return res.json({
      status: true,
      message: "OTP sent successfully",
      data: newUser,
    });

  } catch (error) {
    console.error("Checkuser Error ❌", error);
    return res.status(500).json({
      status: false,
      message: "Server error",
      data: {},
    });
  }
};

// export const Checkuser = async (req, res) => {
//     console.log('   Request Body:', req.body);
//     if (!req.body || Object.keys(req.body).length === 0) {
//         console.log('   Empty request body');
//         return res.status(400).send({
//             status: false,
//             message: 'Request body required',
//             data: {}
//         });
//     }
//     if (!req.body.mobile) {
//         return res.status(400).send({
//             status: false,
//             message: 'Mobile is required in request body',
//             data: {}
//         });
//     }
//     try {
//         let IsMobileExist = await User.findOne({ mobile: req.body.mobile });
//         let IsDeviceExist = req.body.device_token
//             ? await User.findOne({ device_token: req.body.device_token })
//             : null;
//         console.log('   IsDeviceExist:', IsDeviceExist);

//         // If mobile already exists, regenerate OTP, attach token, and return user
//         if (IsMobileExist) {
//             const updated = await User.findByIdAndUpdate(
//                 IsMobileExist._id,
//                 { mobile_verified: true },
//                 { new: true }
//             );
//              const token = await jwt.sign({ time: Date(), user_id: updated._id }, 'Coachinge');
//             // Prepare safe object for response (remove sensitive fields)
//             const safe = updated.toObject ? updated.toObject() : JSON.parse(JSON.stringify(updated));
//             safe.token = token;
//             delete safe.otp;
//             delete safe.password;
//             return res.send({
//                 status: 'true',
//                 message: 'Mobile already registered',
//                 data: safe
//             });
//         }

//         // If device token is present and it's registered to a different user, reject
//         if (IsDeviceExist && IsDeviceExist.mobile !== req.body.mobile) {
//             const safeDeviceUser = IsDeviceExist.toObject ? IsDeviceExist.toObject() : JSON.parse(JSON.stringify(IsDeviceExist));
//             delete safeDeviceUser.otp;
//             delete safeDeviceUser.password;
//             return res.send({
//                 status: 'false',
//                 message: 'Device already registered to another user',
//                 data: safeDeviceUser
//             });
//         }

//         const otp = Math.floor(1000 + Math.random() * 9000);
//         const userPayload = {
//             ...req.body,
//             mobile_verified: true,
//             otp,        
//         };

//         const Users = await User.create(userPayload);
//         // const token = await jwt.sign({ time: Date(), user_id: Users._id }, 'Coachinge');
//         const safeNew = Users.toObject ? Users.toObject() : JSON.parse(JSON.stringify(Users));

//         return res.send({
//             status: 'true',
//             message: 'User Signup Successfully, OTP sent to mobile',
//             data: safeNew
//         });
//     } catch (err) {
//         console.log('   Error in signup:', err);
//         return res.status(500).send({
//             status: false,
//             msg: "Something wrong with request.",
//             data: err
//         });
//     }
// }

export const login = async (req, res) => {
    try{
        let IsEmailExist = await myUser.findOne({ email: req.body.email })
        if(IsEmailExist){
           let getUserData=await myUser.findOne({ email: req.body.email })
           let checkPass = await bcrypt.compare(req.body.password,getUserData.password)
           if(checkPass){
            getUserData.token= await jwt.sign({time:Date(), user_id: getUserData._id,},'Coachinge')
            res.send({
                status: 'true',
                massagge: 'User login Successfully',
                data: getUserData
            })

           }else{
            res.send({
                status: 'false',
                massagge: 'Password worng!',
                data: {}
            })
           }

        }else{
            res.send({
                status: 'false',
                massagge: 'Email Not Eixts',
                data: {}
            })
        }

    }
    catch (err){
        res.status(500).send({
           status:false,
           msg:"Something wrong with request.",
           data:err
        })
     }


}

export const OtpVerify = async (req, res) => {
  try {
    const { mobile, otp,device_token } = req.body;

    const user = await myUser.findOne({ mobile, otp,device_token });
    console.log('user', user);

    if (!user) {
      return res.json({
        status: false,
        msg: "Invalid OTP",
      });
    }

    user.number_verified = true;
    // user.otp = undefined; // ✅ IMPORTANT FIX

    const token = jwt.sign(
      { user_id: user._id },
      process.env.JWT_SECRET || "Coachinge",
      { expiresIn: "7d" }
    );

    user.token = token;
    await user.save();

    return res.json({
      status: true,
      msg: "OTP verified successfully",
      data: {
        mobile: user.mobile,
        token,
      },
    });

  } catch (error) {
    console.error("OTP Verify Error ❌", error);
    return res.status(500).json({
      status: false,
      msg: "Server error",
    });
  }
};





  




