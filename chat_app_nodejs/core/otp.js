const nodemailer = require("nodemailer");
require("dotenv").config();
const otpGenerator = require("otp-generator");

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Token JWT Class
class OTP {
  // Generate OTP
  async generateOTP() {
    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // OTP
    return otp;
  }

  async mailSenderForgot(email, newPassword) {
    // Exception
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });

      // Send emails to users
      const info = await transporter.sendMail({
        from: "www.sandeepdev.me - Sandeep Singh",
        to: email,
        subject: "New Password",
        html: 
          `
            <h1>Mật khẩu mới cho tài khoản ${email}</h1>
            <span>Mật khẩu mới: <h3>${newPassword}</h3></span>
          `,
      });

      //  Return
      return info;
    } catch (error) {
      // Throw Error
      throw new Error(error.message);
    }
  }

  async mailSender(email, otp) {
    // Exception
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });

      // Send emails to users
      const info = await transporter.sendMail({
        from: "www.sandeepdev.me - Sandeep Singh",
        to: email,
        subject: "Verification Email",
        html: 
          `
            <h1>Xác thực Tshus Chat App OTP</h1>
            <span>Mã OTP: <h3>${otp}</h3></span>
          `,
      });

      //  Return
      return info;
    } catch (error) {
      // Throw Error
      throw new Error(error.message);
    }
  }
}

module.exports = new OTP();
