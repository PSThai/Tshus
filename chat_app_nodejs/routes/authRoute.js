const express = require("express");
const { login, register, sendOtp, verifyOTP, checkForgot, sendForgot} = require("../controllers/authController");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post('/verify/check', verifyOTP)
router.post('/verify/create', sendOtp)
router.post('/forgot/check', checkForgot)
router.post('/forgot/send', sendForgot)

module.exports = router;
