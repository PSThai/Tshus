const roomMembersServices = require("../services/roomsMemberServices");

class RoomMembersController {
  async page(req, res, next) {
    // Params data
    const params = req.query;

    // Exceptionn
    try {
      // Created
      const page = await roomMembersServices.page(params);

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

  async deletes(req, res, next) {
    // Params data
    const params = req.query;

    // Exceptionn
    try {
      // Created
      const page = await roomMembersServices.delete(params);

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

  async add(req, res, next) {
    // Body data
    const body = req.body;

    // Exceptionn
    try {
      // Created
      const page = await roomMembersServices.add(body);

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
}

module.exports = new RoomMembersController();
