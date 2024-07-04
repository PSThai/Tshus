const { createToken } = require("../core/token");
const UsersModel = require("../models/UsersModel");
const bcrypt = require("bcrypt");
const OTP = require("../core/otp");
const validator = require("validator");
const cache = require("memory-cache");

class AuthServices {
  // Login
  async login(props) {
    // Exception
    try {
      let user = await UsersModel.findOne({ email: props.email });

      if (!user) throw Error("Tài khoản hoặc mật khẩu không đúng");

      const isValidPassword = await bcrypt.compare(
        props.password,
        user.password,
      );

      if (!isValidPassword) throw Error("Tài khoản hoặc mật khẩu không đúng");

      // Token
      const token = createToken(user._id);

      // Remove password
      const { password, ...data } = user._doc;

      // Return
      return {
        token: token,
        user: { ...data },
      };
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }

  async register(props) {
    // Exception
    try {
      const { email, phone, password, firstname, lastname, gender } = props;

      const user = await UsersModel.findOne({ email });

      //  Check user is valid
      if (user)
        //  Return
        return {
          status: 400,
          message: "User with the given email already exists.",
        };

      if (!email || !password || !phone) {
        //  Return
        return {
          status: 400,
          message: "Vui lòng nhập đầy đủ các trường.",
        };
      }

      if (!validator.isEmail(email)) {
        //  Return
        return {
          status: 400,
          message: "Email không đúng định dạng.",
        };
      }
      if (!validator.isMobilePhone(phone, "any", { strictMode: false })) {
        //  Return
        return {
          status: 400,
          message: "Số điện thoại không đúng định dạng",
        };
      }

      //  Salt password
      const salt = await bcrypt.genSalt(10);

      //  Hash password
      const hashPassword = await bcrypt.hash(password, salt);

      // Create User
      const created = new UsersModel({
        email,
        phone,
        gender: gender,
        roles: ["USER"],
        password: hashPassword,
        nickname: `${firstname} ${lastname}`,
        online: { state: "OFFLINE", time: Date.now() },
      });

      // Save to database
      await created.save();

      // Delete otp from cache
      cache.del(email);

      // Return
      return {
        status: 200,
        message: "Đăng ký thành công.",
      };
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }

  async sendOtp(body) {
    // Exception
    try {
      // Find user
      const find = await UsersModel.findOne({ email: body.email });

      // If user is exist
      if (find) throw new Error("Tài khoản đã được đăng ký");

      // Create Email OTP
      const otp = await OTP.generateOTP();

      // Sender to email
      await OTP.mailSender(body.email, otp);

      // Push OTP to cache
      cache.put(
        body.email,
        JSON.stringify({ otp, verify: false }),
        5 * 1000 * 60,
      );

      // Return
      return otp;
    } catch (error) {
      // Throw error
      throw Error(error.message);
    }
  }

  async verifyOTP(params) {
    // Exception
    try {
      // Get cache otp
      const JSON_OTP = await cache.get(params.email);

      // Check OTP is exist
      if (JSON_OTP) {
        // OTP
        const { otp } = JSON.parse(JSON_OTP);

        // Check match otp
        if (otp !== params.otp)
          throw new Error("OTP không trùng khớp, vui lòng thử lại");

        // Change verify to true
        cache.put(
          params.email,
          JSON.stringify({ otp, verify: true }),
          60 * 1000 * 60,
        );

        // Return
        return otp;
      }

      // Throw error
      throw new Error("OTP chưa được tạo hoặc đã hết hạn");

      // Return
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }

  async generateRandomString(length) {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    while (!checkPassword(password, requirements)) {
      password = "";
      for (let i = 0; i < length; i++) {
        password += characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
      }
    }
    return password;
  }

  async sendForgotOtp(body) {
    // Exception
    try {
      // Find user
      const find = await UsersModel.findOne({ email: body.email });

      // If user is exist
      if (!find) throw new Error("Tài khoản Không có trong hệ thống");

      // Create Email OTP
      const otp = await OTP.generateOTP();

      // Sender to email
      await OTP.mailSender(body.email, otp);

      // Push OTP to cache
      cache.put(
        body.email,
        JSON.stringify({ otp, verify: false }),
        5 * 1000 * 60,
      );

      // Return
      return otp;
    } catch (error) {
      // Throw error
      throw Error(error.message);
    }
  }

  async checkForgotOtp(params) {
    // Exception
    try {
      // Get cache otp
      const JSON_OTP = await cache.get(params.email);

      // Check OTP is exist
      if (JSON_OTP) {
        // OTP
        const { otp } = JSON.parse(JSON_OTP);

        // Check match otp
        if (otp !== params.otp)
          throw new Error("OTP không trùng khớp, vui lòng thử lại");

        // New password
        const newPassword = await this.generateRandomString(8);

        // Hash password
        const salt = await bcrypt.genSalt(10);

        // Hash
        const hashPassword = await bcrypt.hash(newPassword.toString(), salt);

        // Update password
        await UsersModel.updateOne(
          { email: params.email },
          {
            password: hashPassword,
          },
        );

        // Sender to email
        await OTP.mailSenderForgot(params.email, newPassword.toString());

        // Return
        return true;
      }

      // Return
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }
}

module.exports = new AuthServices();
