const ChatsServices = require("../services/chatsServices");

class ChatsController {
  // Lấy ra dữ liệu của chats
  async get(req, res, next) {
    // Params Data
    const params = req.query;

    // Exception
    try {
      // Call services
      const chats = await ChatsServices.get(params);

      // Send Response
      res.status(200).json({
        data: chats,
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

  // Kiểm tra xem nếu có rồi thì trả về còn chưa có thì tạo mới
  async join(req, res, next) {
    // Body Data
    const body = req.body;

    // Exception
    try {
      // Call services
      const joined = await ChatsServices.join(body);

      // Send Response
      res.status(200).json({
        data: joined,
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
}

module.exports = new ChatsController();
