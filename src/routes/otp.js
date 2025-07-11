
const express=require("express");
const otpRouter=express.Router();
const Otps = require('../models/otpModel')
const randomstring = require('randomstring');
const sendEmail = require('../utils/sendEmails');

// Generate OTP
function generateOTP() {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
}
otpRouter.post("/sendOTP",async(req,res)=>{
    try {
        const { email } = req.body;
        const otp = generateOTP(); // Generate a 6-digit OTP
        const newOTP = new Otps({ email, otp:String(otp) });
        await newOTP.save();

        // Send OTP via email
        await sendEmail({
            to: email,
            subject: 'Your OTP',
            message: `<p>Your OTP is: <strong>${otp}</strong></p>`,
        });

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error'+error });
    }
})

otpRouter.post("/verifyOTP",async(req,res)=>{
    try {
        const { email, otp } = req.body;
        const existingOTP = await Otps.findOneAndDelete({ email, otp:otp });

        if (existingOTP) {
            // OTP is valid
            res.status(200).json({ success: true, message: 'OTP verification successful' });
        } else {
            // OTP is invalid
            res.status(400).json({ success: false, error: 'Invalid OTP' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
})
module.exports={
    otpRouter
};