const express = require("express");
const { userAuthentication } = require("../middlewares/auth");
const instance = require("../utils/Razorpay");
const user = require("../models/user");
const Payment = require("../models/payment");
const { membershipAmount } = require("../utils/constants");
const paymentRouter = express.Router();
const {validateWebhookSignature} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuthentication, async (req, res) => {
  try {
    const {membershipType}=req.body;
    const{firstName,lastName,emailId}=req.user;
    const order=await instance.orders.create({
      amount: membershipAmount[membershipType]*100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        memberShipType: membershipType,
      },
    });
    console.log(">>>>"+order+" "+membershipAmount[membershipType]*100);
    const payment=new Payment({
        userId: req.user._id,
        orderId: order.id,
        status: order.status,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        notes: order.notes 
    })
    const savedPayment = await payment.save();
    res.json({
      success: true,
      message: "Order created successfully",
      data: savedPayment.toJSON(),
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    return res.status(500).send({ success: false, error: error.message });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");

    const isWebhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isWebhookValid) {
      return res.status(400).json({ msg: "Webhook signature is invalid" });
    }

    // Udpate my payment Status in DB
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment?.notes?.membershipType;
    await user.save();

    // Update the user as premium

    // if (req.body.event == "payment.captured") {
    // }
    // if (req.body.event == "payment.failed") {
    // }

    // return success response to razorpay

    return res.status(200).json({ msg: "Webhook received successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});
module.exports = paymentRouter;
