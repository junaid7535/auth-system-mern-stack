import { Router } from "express";
import express from 'express'
import {register,login,logout, sendVerificationOTP, verifyEmail,isAuthenticated,sendResetOtp,resetPassword} from '../controllers/authController.js'
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

router.post('/registerUser',register);
router.post('/loginUser',login);
router.post('/logoutUser',logout)
router.post('/send-verify-otp',userAuth,sendVerificationOTP);
router.post('/verify-account',userAuth,verifyEmail);
router.get('/is-auth',userAuth,isAuthenticated);
router.post('/sendResetOtp',sendResetOtp);
router.post('/resetPassword',resetPassword);

export default router