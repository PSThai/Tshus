const ConversationsModel = require("../models/conversationsModel");
const UsersModel = require("../models/UsersModel");
const mongoose = require("mongoose");

class ConversationsServices {
  // Get Services
  async create(props) {
    // Body data
    const body = props;

    // Exception
    try {
      // Created
      const created = await ConversationsModel.create({
        type: body?.type,
        created_at: new Date(),
      });

      // Return
      return created;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  // Get Services
  async pin(props) {
    // Exception
    try {
      // Updated
      const updated = await ConversationsModel.findByIdAndUpdate(
        new mongoose.Types.ObjectId(props.conversation),
        { pins: [props] },
      );

      // Return
      return updated;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  async get(props) {
    // Prams Data
    const params = props;

    // Exception
    try {
      // Get
      const conversation = await ConversationsModel.findOne({
        _id: params?._id,
      });

      // Return
      return conversation;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  async search(props) {
    // Params Data
    const params = props;

    // Exception
    try {
      const limit = 10;

      // Finded
      const userFinded = await UsersModel.find({
        $and: [
          {
            $text: {
              $search: params?.search,
            },
          },
          {
            $expr: {
              $not: {
                $eq: ["$_id", new mongoose.Types.ObjectId(params?.user)],
              },
            },
          },
        ],
      })
        .select("-password")
        .skip((params.page - 1) * limit)
        .limit(limit);

      // Finded
      const finded = await ConversationsModel.aggregate([
        {
          $lookup: {
            as: "chats",
            from: "chats",
            localField: "_id",
            foreignField: "conversation",
            let: { conversationId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$conversation", "$$conversationId"] },
                      {
                        $or: [
                          {
                            $in: [
                              "$inviter.user",
                              userFinded.map((user) => user._id),
                            ],
                          },
                          {
                            $eq: [
                              "$friend.user",
                              userFinded.map((user) => user._id),
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "rooms",
            as: "rooms",
            localField: "_id",
            foreignField: "conversation",
            pipeline: [
              {
                $lookup: {
                  from: "roommembers",
                  let: { roomId: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$room", "$$roomId"] },
                            {
                              $in: [
                                "$user",
                                userFinded.map((user) => user._id),
                              ],
                            },
                          ],
                        },
                      },
                    },
                  ],
                  as: "roommembers",
                },
              },
            ],
          },
        },
        {
          $match: {
            $expr: {
              $not: {
                $and: [{ $eq: ["$chats", []] }, { $eq: ["$rooms", []] }],
              },
            },
          },
        },
        { $limit: limit },
        { $skip: (params.page - 1) * limit },
      ]);

      // Return
      return finded;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  async join(body, withRef) {
    // Exception
    try {
      // Get conversation
      const cvs = withRef
        ? await this.getWithRef(body)
        : await this.get(body?._id);

      if (cvs) return cvs;

      // Created
      const created = await ConversationsModel.create({
        type: body?.type,
        created_at: new Date(),
      });

      if (!withRef) return created;

      // Return
      return await this.getWithRef({
        _id: created?._id,
        type: created?.type,
      });
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  async page(props) {
    // Params Data
    const params = props;

    // Exception
    try {
      const limit = 10;

      const finded = await ConversationsModel.aggregate([
        {
          $lookup: {
            as: "chats",
            from: "chats",
            localField: "_id",
            foreignField: "conversation",
            let: { conversationId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      {
                        $and: [
                          { $eq: ["$conversation", "$$conversationId"] },
                          {
                            $eq: [
                              "$inviter.user",
                              new mongoose.Types.ObjectId(params.user),
                            ],
                          },
                        ],
                      },
                      {
                        $and: [
                          { $eq: ["$conversation", "$$conversationId"] },
                          {
                            $eq: [
                              "$friend.user",
                              new mongoose.Types.ObjectId(params.user),
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "rooms",
            as: "rooms",
            localField: "_id",
            foreignField: "conversation",
            pipeline: [
              {
                $lookup: {
                  from: "roommembers",
                  let: { roomId: "$_id" },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$room", "$$roomId"] },
                            {
                              $eq: [
                                "$user",
                                new mongoose.Types.ObjectId(params.user),
                              ],
                            },
                          ],
                        },
                      },
                    },
                  ],
                  as: "roommembers",
                },
              },
            ],
          },
        },
        {
          $match: {
            $expr: {
              $not: {
                $and: [{ $eq: ["$chats", []] }, { $eq: ["$rooms", []] }],
              },
            },
          },
        },
        { $limit: limit },
        { $skip: (params.page - 1) * limit },
      ]);

      // Return
      return finded;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  // Check type and render mes
  render_last_message(mes) {
    // Sender lastname
    const lastname = mes.sender?.nickname?.split(" ")[1];

    // Swithcare
    switch (mes.type) {
      case "FILES":
        return `${lastname} đã gửi ${mes.files.length} tệp tin.`;
      case "VOICE":
        return `${lastname} đã gửi tin nhắn thoại.`;
      default:
        // Return
        return `${lastname}: ${mes.messages}`;
    }
  }

  // Set last message
  async set_last_message(message) {
    // Exception
    try {
      // Message text
      const text = this.render_last_message(message);

      // Return
      await ConversationsModel.updateOne(
        { _id: message.conversation },
        { last_message: text, last_send: message.send_at },
      );

      // Return
      return text;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  async getWithRef(params) {
    // Exception
    try {
      // Match type
      const type = params?.type.toLowerCase();

      const finded = await ConversationsModel.aggregate([
        { $match: { _id: params?._id } },
        {
          $lookup: {
            as: type,
            from: type,
            localField: "_id",
            foreignField: "conversation",
          },
        },
      ]);

      // Return
      return finded[0];
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }
}

module.exports = new ConversationsServices();
