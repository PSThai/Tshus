const authServices = require("../services/authServices");

class AuthController {
  // Login
  async login(req, res, next) {
    // Body Data
    const body = req.body;

    // Exception
    try {
      // Call services
      const loged = await authServices.login(body);

      // Send Response
      res.status(200).json({
        data: loged,
        status: 200,
      });

      // Next
      next();
    } catch (error) {
      // Send Error
      res.status(500).json({
        message: error.message,
        status: 500,
      }) && next(error);
    }
  }
  
  async verifyOTP(req, res, next) {
    // Exception
    try {
      // Get OTP
      await authServices.verifyOTP(req.body);
  
      // Send
      res.status(200).json({ message: 'Xác thực OTP thành công' });

      // Next
      next();
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: 500,
      });  
    }
  }
  
  async register(req, res, next) {
    // Body Data
    const body = req.body;

    // Exception
    try {
      // Call services
      const registed = await authServices.register(body);

      // Send Response
      res.status(registed.status).json(registed);

      // Next
      next();
    } catch (error) {
      // Send Error
      res.status(500).json({
        message: error.message,
        status: 500,
      }) && next(error);
    }
  }
  async sendOtp(req, res, next) {
    // Exception
    try {
      // OTP
      await authServices.sendOtp(req.body);
  
      // Send
      res.status(200).json({ message: 'Tạo mã OTP thành công, vui lòng kiểm tra Email' });

      // Next
      next();
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: 500,
      }) && next(error);    }
  };

  async sendForgot(req, res, next) {
    // Exception
    try {
      // OTP
      await authServices.sendForgotOtp(req.body);
  
      // Send
      res.status(200).json({ message: 'Tạo mã OTP thành công, vui lòng kiểm tra Email' });

      // Next
      next();
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: 500,
      }) && next(error);    }
  };

  async checkForgot(req, res, next) {
    // Exception
    try {
      // OTP
      await authServices.checkForgotOtp(req.body);
  
      // Send
      res.status(200).json({ data: 'Mật khẩu mới sẽ được gửi về Email' });

      // Next
      next();
    } catch (error) {
      res.status(500).json({
        message: error.message,
        status: 500,
      }) && next(error);    }
  };
}

module.exports = new AuthController();
