const usersServices = require("../services/usersServices");

class UsersController {
  // GET
  async get(req, res, next) {
    // Body Data
    const body = req.query;

    // Exception
    try {
      // Call services
      const user = await usersServices.get(body);

      // Send Response
      res.status(200).json({
        data: user,
        status: 200
      });

      // Next
      next();
    } catch (error) {
      // Send Error
      res.status(500).json({
        message: error.message,
        status: 500
      }) && next(error);   
    }
  }

  async find(req, res, next) {
    // Body Data
    const body = req.query;

    // Exception
    try {
      // Call services
      const finded = await usersServices.find(body);

      // Send Response
      res.status(200).json({
        data: finded,
        status: 200
      });

      // Next
      next();
    } catch (error) {
      // Send Error
      res.status(500).json({
        message: error.message,
        status: 500
      }) && next(error);   
    }
  }

  async update(req, res, next) {
    // Body Data
    const body = req.body;

    // Exception
    try {
      // Call services
      const updated = await usersServices.update(body);

      // Send Response
      res.status(200).json({
        data: updated,
        status: 200
      });

      // Next
      next();
    } catch (error) {
      // Send Error
      res.status(500).json({
        message: error.message,
        status: 500
      }) && next(error);   
    }
  }
}

module.exports = new UsersController();
