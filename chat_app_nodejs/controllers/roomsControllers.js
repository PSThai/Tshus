const roomsServices = require("../services/roomsServices");

class RoomsController {
  // Create Rooms
  async create(req, res, next) {
    // Body Data
    const body = req.body;

    // Exception
    try {
      // Call services
      const rooms = await roomsServices.create(body);

      // Send Response
      res.status(201).json({
        data: rooms,
        status: 201,
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

module.exports = new RoomsController();
