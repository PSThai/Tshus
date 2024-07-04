const messagesServices = require("../services/messagesServices");
class MessagesController {
  async create(req, res, next) {
    // Body data
    const body = req.body;

    // Exceptionn
    try {
      // Created
      const created = await messagesServices.create(body);

      // Return
      res.status(201).json({
        data: created,
        status: 201,
      });

      // Next
      next();
    } catch (error) {
      // throw http exception
      res.status(500).json({
        messsages: error.message,
        status: 500,
      }) && next(error);
    }
  }

  // POST /transfer
  async transfer(req, res, next) {
    // Body data
    const body = req.body;

    // Exceptionn
    try {
      // Created
      const created = await messagesServices.transfer(body);

      // Return
      res.status(200).json({
        data: created,
        status: 200,
      });

      // Next
      next();
    } catch (error) {
      // throw http exception
      res.status(500).json({
        messsages: error.message,
        status: 500,
      }) && next(error);
    }
  }

  async page(req, res, next) {
    // Params data
    const params = req.query;

    // Exceptionn
    try {
      // Created
      const page = await messagesServices.page(params);

      // Return
      res.status(200).json({
        data: page,
        status: 200,
      });

      // Next
      next();
    } catch (error) {
      // throw http exception
      res.status(500).json({
        messsages: error.message,
        status: 500,
      }) && next(error);
    }
  }

  async upload(req, res, next) {
    // Exception
    try {
      // Parse data
      const files = req.files;

      // Upload
      const uploadedFilesInfo = await messagesServices.upload(files);

      // Return res
      res.status(201).json({
        data: uploadedFilesInfo,
        status: 200,
      });

      // Next
      next();
    } catch (error) {
      // throw http exception
      res.status(500).json({
        messsages: error.message,
        status: 500,
      }) && next(error);
    }
  }

  async unmessage(req, res, next) {
    try {
      // Params
      const params = req.query;

      // Unmessaged
      await messagesServices.unmessage(params);

      // Trả về kết quả cho client
      res.status(200).json({
        message: "Unmessage successfully",
        status: 200,
      });

      // Next
      next();
    } catch (error) {
      // Send Errro
      res.status(500).json({
        messsages: error.message,
        status: 500,
      });
    }
  }

  async remove(req, res, next) {
    try {
      // Params Data
      const params = req.query;

      // Deleted
      await messagesServices.delete(params);

      // Trả về kết quả cho client
      res.status(200).json({
        message: "Delete message successfully",
        status: 200,
      });

      // Next
      next();
    } catch (error) {
      res.status(500).json({
        messsages: error.message,
        status: 500,
      }) && next(error);
    }
  }

  async forwardMessage(req, res, next) {
    const id = req.params;
    const { conversationId } = req.body;
    try {
      const newMessage = await messagesServices.forwardMessage(
        id,
        conversationId,
      );
      res.status(200).json({
        message: "Chuyển tin nhắn thành công",
        status: 200,
      });
    } catch (error) {
      res.status(500).json({
        messsages: error.message,
        status: 500,
      }) && next(error);
    }
  }
}

module.exports = new MessagesController();
