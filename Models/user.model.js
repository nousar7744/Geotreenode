import mongoose from "mongoose";

const UserShema = new mongoose.Schema({
    username:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:false
    },
    privacy_policy:{
        type:Boolean,
        required:false,
        default:false
    },
    password:{
        type:String,
        required:false
    },
    token:{
        type:String,
        required:false
    },
    device_token:{
        type:String,
        required:true
    },
    mobile: {
        type: Number,
        required: true
    },
    email_verified:{
        type:Boolean,
        required:false,
        default:false
    },
    number_verified:{
        type:Boolean,
        required:false,
        default:false
    },
   
    otp:{
        type:Number,
        required: true 
    },
    amount:{
        type:Number,
        required:false,
        default:0
    }
   
})
const User = mongoose.model("users", UserShema);
export default User;