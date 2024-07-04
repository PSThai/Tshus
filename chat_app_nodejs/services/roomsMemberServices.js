const RoomMembersModel = require("../models/roomMembersModel");
const mongoose = require("mongoose");

class roomMembersServices {
  async check_role(user, role) {
    // Exception
    try {
      // Return
      return await RoomMembersModel.findOne({
        user: new mongoose.Types.ObjectId(user),
        role,
      });
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  // Add member services
  async create(room, creater, members) {
    // Map insert data
    const data = members.map((member) => ({
      room: room,
      user: member.member.user,
      nickname: member.member.nickname,
      role: member.role,
    }));

    // Exception
    try {
      // Created
      const insert = await RoomMembersModel.insertMany([
        {
          room: room,
          user: creater.member.user,
          nickname: creater.member.nickname,
          role: creater.role,
        },
        ...data,
      ]);

      // Create
      return insert;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  // Add member services
  async add(body) {
    // Exception
    try {
      // Finded
      const finded = await RoomMembersModel.findOne({
        user: new mongoose.Types.ObjectId(body.member.member.user),
        room: new mongoose.Types.ObjectId(body.room),
      });

      // Check finded
      if (!finded) {
        // Delete
        return await RoomMembersModel.create({
          nickname: body.member.member.nickname,
          user: body.member.member.user,
          room: body.room,
          role: body.member.role,
        });
      } else {
        // Throw http exception
        throw new Error("Thành viên này đã có trong nhóm");
      }
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  async delete(params) {
    // Exceptionn
    try {
      // Delete
      return await RoomMembersModel.deleteOne({
        _id: new mongoose.Types.ObjectId(params.member),
      });
    } catch (error) {
      // throw http exception
      throw new Error(error.message);
    }
  }

  async page(params) {
    // Exceptionn
    try {
      // Finded
      const finded = await RoomMembersModel.find({
        room: new mongoose.Types.ObjectId(params.room),
      });

      // Return
      return finded;
    } catch (error) {
      // throw http exception
      throw new Error(error.message);
    }
  }
}

module.exports = new roomMembersServices();
