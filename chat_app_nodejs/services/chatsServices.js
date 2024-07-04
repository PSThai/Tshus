const chatsModel = require("../models/chatsModel");
const ConversationsServices = require("../services/conversationsServices");
const mongoose = require("mongoose");

class ChatsServices {
  async get(props) {
    // Body data
    const params = props;

    // Exception
    try {
      // Find
      return await chatsModel.findOne({
        "inviter.user": params.inviter,
        "friend.user": params.friend,
      });
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  // Kiểm tra xem nếu có rồi thì trả về còn chưa có thì tạo mới
  async join(props) {
    // Body data
    const body = props;

    // Chat type
    const type = "CHATS";

    // Find chat
    const finded = await this.get({
      inviter: body.inviter.user.toString(),
      friend: body.friend.user.toString(),
    });

    let _id = finded?.conversation;

    if (!finded) {
      // Joined conversation
      const joinedCvs = await ConversationsServices.join({ type });

      // Assign conversation
      _id = joinedCvs?._id.toString();

      // Create chats
      await chatsModel.create({
        conversation: _id,
        friend: body.friend,
        inviter: body.inviter,
        created_at: new Date(),
      });
    }

    // Get with ref
    const getWithRef = await ConversationsServices.getWithRef({
      _id: new mongoose.Types.ObjectId(_id), type,
    });

    // Return
    return getWithRef;
  }
}

module.exports = new ChatsServices();
