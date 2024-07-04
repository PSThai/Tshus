const FriendsServices = require("../services/friendsServices");

class FriendsController {
  // Tìm kiếm bạn bè
  async search(req, res, next) {
    // Body Data
    const body = req.query;

    // Exception
    try {
      // Call services
      const finded = await FriendsServices.search(body);

      // Send Response
      res.status(200).json({
        data: finded,
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

  // Tìm kiếm bạn bè
  async page(req, res, next) {
    // Body Data
    const body = req.query;

    // Exception
    try {
      // Call services
      const page = await FriendsServices.page(body);

      // Send Response
      res.status(200).json({
        data: page,
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

  async load_request(req, res, next) {
    // Body Data
    const body = req.query;

    // Exception
    try {
      // Call services
      const page = await FriendsServices.load_request(body);

      // Send Response
      res.status(200).json({
        data: page,
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

  // Gửi request kết bạn với người khác
  async send(req, res, next) {
    // Body Data
    const body = req.body;

    // Exception
    try {
      // Call services
      const sended = await FriendsServices.send(body);

      // Send Response
      res.status(200).json({
        data: sended,
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
  async cancel(req, res, next) {
    // Params Data
    const params = req.query;

    // Exception
    try {
      // Result
      const result = await FriendsServices.cancel(params.id);

      // Gửi phản hồi
      res.status(200).json({
        data: result,
        status: 200,
      });

      // Next
      next();
    } catch (error) {
      // Xử lý lỗi
      res.status(500).json({
        message: error.message,
        status: 500,
      }) && next(error);
    }
  }

  async accept(req, res, next) {
    // Params Data
    const params = req.body;

    // Exception
    try {
      // Result
      const result = await FriendsServices.accept(params.id);

      // Gửi phản hồi
      res.status(200).json({
        data: result,
        status: 200,
      });

      // Next
      next();
    } catch (error) {
      // Xử lý lỗi
      res.status(500).json({
        message: error.message,
        status: 500,
      }) && next(error);
    }
  }

  async unfriend(req, res, next) {
    const { inviter, friend } = req.body;

    try {
      const inviterId = inviter.user;
      const friendId = friend.user;

      const result = await FriendsServices.unfriend(inviterId, friendId);
      // Gửi phản hồi
      res.status(200).json({
        data: result,
        status: 200,
      });
    } catch (error) {
      // Xử lý lỗi
      res.status(500).json({
        message: error.message,
        status: 500,
      });
      next(error);
    }
  }
}

module.exports = new FriendsController();
