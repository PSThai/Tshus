const UsersModel = require("../models/UsersModel");
const FriendsService = require("./friendsServices");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

class UsersServices {
  // Get Services
  async get(props) {
    // Exception
    try {
      // Users
      const users = await UsersModel.find({ _id: props.id });

      // Return
      return users;
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }

  // Get Services
  async update(props) {
    // Exception
    try {
      const { _id, password, ...values } = props;

      // Find user
      const finded = await UsersModel.findOne({
        _id: new mongoose.Types.ObjectId(_id),
      });

      // Check user valid
      if (!finded) throw new Error("Không tìm thấy người dùng");

      // Check password
      const isValidPassword = await bcrypt.compare(
        password,
        finded.password,
      );

      // Check password
      if (!isValidPassword) throw Error("Mật khẩu xác thực không đúng");

      // Users
      const updated = await UsersModel.updateOne(
        { _id: new mongoose.Types.ObjectId(_id) },
        {
          ...values,
        },
      );

      // Return
      return updated;
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }

  async find(props) {
    // Exception
    try {
      // Find user
      const finded = await UsersModel.findOne({
        email: props.search,
        _id: { $ne: props.user },
      }).exec();

      // Check finded
      if (!finded) return null;

      // Friend find
      const friend = await FriendsService.check(
        props.user.toString(),
        finded._id.toString(),
      );

      // Destrucs Data
      const { password, ...data } = finded._doc;

      // Return
      return { ...data, ...friend };
    } catch (e) {
      // Throw error
      throw new Error(e.message);
    }
  }
}
module.exports = new UsersServices();
