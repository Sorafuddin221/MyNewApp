import mongoose from "mongoose";
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';


const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please Enter you name"],
        maxLength:[25,"Invalid name.plase enter a name with fewr then 25 characters"],
        minLength:[3,"Name should contain more than 3 characters"]
    },
    email:{
        type:String,
        required:[true,"please Enter you email"],
        unique:true,
        validate:[validator.isEmail,"please enter valid email"]
    },
    password:{
        type:String,
        required:[true,"please Enter you password"],
        minLength:[8,"password should be greater then 8 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date
},{timestamps:true})
//password hasing
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password=await bcryptjs.hash(this.password,10)
    next();
})
userSchema.methods.getJWTToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY || "fallback-secret-key",{
        expiresIn:process.env.JWT_EXPIRE || '1d'
    })
}
userSchema.methods.VerifyPassword=async function(userEnterPassword){
    return await bcryptjs.compare(userEnterPassword,this.password);
}
//generating token
userSchema.methods.generatePasswordResetToken=function(){
    const resetToken=crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=Date.now()+5*60*1000 //30 misnutes
    return resetToken;
}

let User;

try {
    User = mongoose.model("User");
} catch (error) {
    User = mongoose.model("User", userSchema);
}

export default User;