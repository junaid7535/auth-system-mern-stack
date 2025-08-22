import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import transporter from '../config/nodemailer.js'


export const register = async(req,res) => {
    const {name ,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({
            success : false,
            message : 'All fields are mandatory'
        })
    }


    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                success : false,
                message : 'User already exists'
            })
        }

        const hashPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password : hashPassword
        })
        await user.save()

        
        const token = jwt.sign({id : user._id},process.env.JWT_SECRET,{expiresIn : '7D'})
        res.cookie('token',token,{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        })

        const mail = {
            from : process.env.SENDER_EMAIL,
            to : email,
            subject : 'welcome',
            text : 'welcome, you are waiting for coming'
        }
        await transporter.sendMail(mail);

        return res.json({success : true,message : 'user registered successfully'});
    }
    catch(e){
        return res.status(400).json({
            success : false,
            message : e.message
        })
    }
}

export const login = async (req,res) => {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(404).json({
            success : false,
            message : 'All fields are mandatory'
        })
    }

    try{
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({
                success : false,
                message : 'Invalid Email'
            })
        }

        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return res.status(404).json({
                success : false,
                message : 'Invalid Password'
            })
        }


        const token = jwt.sign({id : user._id},process.env.JWT_SECRET,{expiresIn : '7D'})
        res.cookie('token',token,{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success : true,
            message : 'User logged successfully'
        })
    }
    catch(e){
        return res.status(400).json({
            success : false,
            message : error.message
        })
    }
}

export const logout = async (req,res) => {
    try{
        res.clearCookie('token',{
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge : 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            success : true,
            message : 'User logout successfully'
        })
    }
    catch(e){
        return res.status(400).json({
            success : false,
            message : error.message
        })
    }
}

export const sendVerificationOTP = async(req,res)=>{
    const userId = req.userId;
    const user = await User.findById(userId);
    if(user.isAccountVerified){
        return res.json({
            success : 'false',
            message : 'user already verified'
        })
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOTP = otp;
    user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000 

    await user.save()

    const mail = {
        from : process.env.SENDER_EMAIL,
        to : user.email,
        subject : 'verification otp',
        text : `your otp is ${otp}`
    }
    await transporter.sendMail(mail);

    return res.json({success : true});
}

export const verifyEmail = async(req,res) =>{
    const {otp} = req.body;
    const userId = req.userId;

    if(!userId || !otp){
        return res.json({success : false,message : 'otp not found'});
    }

    const user = await User.findById(userId);
    if(!user){
        return res.json({success:false,message : 'user not found'});
    }

    if(!user.verifyOTP || user.verifyOTP !== otp){
        return res.json({success:false,message : 'invalid otp'});
    }
    if(user.verifyOTPExpireAt < Date.now()){
        return res.json({success : false,message : 'otp expired'});
    }
    user.isAccountVerified = true;
    user.verifyOTP = "";
    user.verifyOTPExpireAt = 0;
    await user.save();

    return res.json({success : true,message : 'email verified successfully'});
}

export const isAuthenticated = async (req,res) => {
    try{
        return res.json({success : true});
    }
    catch(error){
        res.json({success : false,message : error.message})
    }
}

export const sendResetOtp = async(req,res) => {
    const {email} = req.body;
    if(!email){
        res.json({success : false});
    }

    const user = await User.findOne({email});
    if(!user){
        res.json({success : false});
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOTP = otp;
    user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000 

    await user.save()

    const mail = {
        from : process.env.SENDER_EMAIL,
        to : user.email,
        subject : 'reset otp',
        text : `your reset otp is ${otp}`
    }
    await transporter.sendMail(mail);

    return res.json({success : true,message : 'otp send'});
}

export const resetPassword = async(req,res) => {
    const {email, otp ,newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success : false,message : 'email required'});
    }

    const user = await User.findOne({email});
    if(!user){
        return res.json({success : false,message : 'user required'});
    }

    if(user.resetOTP === '' || user.resetOTP !== otp){
        return res.json({success : false,message : 'invalid otp'});
    }

    if(user.resetOTPExpireAt < Date.now()){
        return res.json({success : false,message : 'otp expired'});
    }

    const hashedPassword = await bcrypt.hash(newPassword,10);
    user.password = hashedPassword;

    user.resetOTP = '';
    user.resetOTPExpireAt = 0;
    await user.save();

    return res.json({success : true,message : 'password reset successfully'});
}
