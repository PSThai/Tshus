const FriendsModel = require("../models/FriendsModel");
const ChatsServices = require("./chatsServices");
const UsersModel = require("../models/UsersModel");
const mongoose = require("mongoose");

class FriendsServices {
  //Đặt trạng thái mối quan hệ bạn bè
  async create(props) {
    // Exception
    try {
      // Created
      const friend = await FriendsModel.create(props);

      //  Return
      return friend;
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }

  //Đặt trạng thái mối quan hệ bạn bè
  async page(params) {
    // Exception
    try {
      // Created
      const friend = await FriendsModel.find({
        $and: [
          {
            $or: [
              { "inviter.user": params.user },
              { "friend.user": params.user },
            ],
          },
          { state: "ACCEPTED" },
          { block: false },
        ],
      });

      const data = {};

      // Data
      friend?.forEach((i) => {
        // Check is inviter
        if (i?.inviter?.user?.toString() === params.user) {
          // Group to
          data[i.friend.nickname.charAt(0).toUpperCase()] = [i?.friend];
        } else {
          // Group to
          data[i.inviter.nickname.charAt(0).toUpperCase()] = [i?.inviter];
        }
      });

      //  Return
      return data;
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }

  async load_request(params) {
    // Exception
    try {
      const query = await FriendsModel.find({
        $or: [
          { $and: [{ "friend.user": params.user }, { state: "PENDING" }] },
          { $and: [{ "inviter.user": params.user }, { state: "PENDING" }] },
        ],
      });

      const request = query.filter(
        (r) => r?.friend?.user?.toString() === params.user,
      );
      const sended = query.filter(
        (s) => s?.inviter.user?.toString() === params.user,
      );

      return { request, sended };
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }

  // Gui yeu cau ket ban
  async send(body) {
    // Exception
    try {
      // Check friend is exists
      const friend = await FriendsModel.findOne({
        "inviter.user": body.inviter.user,
        "friend.user": body.friend.user,
      });

      // Throw error if friend is exists
      if (friend) throw new Error("Đã kết bạn", HttpStatus.CONFLICT);

      // Created
      return await this.create(body);
    } catch (error) {
      // Throw Error
      throw new Error(error.message);
    }
  }

  // Check trang thai ban be
  async check(inviter, friend) {
    // Exception
    try {
      // Kiem tra xem 2 nguoi dung co phai ban be khong
      // Check xem neu co id cua minh o trong inviter hoac trong friend thi duoc coi la du lieu co o trong collection friend
      const isFriend = await FriendsModel.findOne({
        $or: [
          {
            $and: [{ "inviter.user": inviter }, { "friend.user": friend }],
          },
          {
            $and: [{ "inviter.user": friend }, { "friend.user": inviter }],
          },
        ],
      });

      // Check xem minh co phai nguoi gui khong
      const isSender = isFriend?.inviter?.user?.toString() === inviter;

      // Return
      return {
        // Cai nay la trang thai ban be, neu da ton tai trong conllection thi tra ve trang thai trong collec, con neu trong collect chua co thi tra ve NOT_YET
        // Van phai de cai NOT_YET ne, bo cai REQUEST :))))
        state: isFriend ? isFriend.state : "NOT_YET",
        // Tra ve xem minh co phai la nguoi gui khong
        isSender,
      };
    } catch (error) {
      // Throw error
      throw new Error(error.message);
    }
  }

  // Tim kiem ban be
  async search(params) {
    // Exception
    try {
      // Limit 
      const limit = params.limit;

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
      const finded = await FriendsModel.find({
        $expr: {
          $and: [
            {
              $or: [
                {
                  $in: [
                    "$inviter.user",
                    userFinded.map((user) => user._id),
                  ],
                },
                {
                  $in: ["$friend.user", userFinded.map((user) => user._id)],
                },
              ],
            },
            {
              $or: [
                {
                  $eq: ["$inviter.user", new mongoose.Types.ObjectId(params.user)],
                },
                {
                  $eq: ["$friend.user", new mongoose.Types.ObjectId(params.user)],
                },
              ],
            },
            { state: "ACCEPTED" },
            { block: false },
          ],
        },
      })
        .skip((params.page - 1) * limit)
        .limit(limit);

      // Return
      return finded;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }

  //hủy lời mời kết ban
  async cancel(body) {
    // Exception
    try {
      // Delete
      const deleted = await FriendsModel.deleteOne({ _id: body.id });

      // Check
      if (!(deleted && deleted?.deletedCount !== 0)) {
        // Throw error
        throw new Error("Huỷ kết bạn không thành công");
      }

      // Return
      return body;
    } catch (error) {
      // Xử lý lỗi
      throw new Error(error.message);
    }
  }

  //Đồng ý lời mời kb
  async accept(body) {
    // Exception
    try {
      // Tìm yêu cầu kết bạn ở trạng thái PENDING
      const updated = await FriendsModel.updateOne(
        { _id: body.id },
        { state: "ACCEPTED" },
      );

      // Check
      if (!updated) {
        // Throw error
        throw new Error("Đồng ý yêu cầu kết bạn không thành công");
      }

      // Recode uploaded
      const updatedRecord = await FriendsModel.findOne({ _id: body.id });

      // Check is valid
      if (updatedRecord) {
        // Create conversation
        const chats = await ChatsServices.join({
          inviter: updatedRecord.inviter,
          friend: updatedRecord.friend,
        });

        // Return
        return { ...body, chats };
      } else {
        // Throw error
        throw new Error("Không tìm thấy bản ghi đã cập nhật");
      }
    } catch (error) {
      // Xử lý lỗi
      throw new Error(error.message);
    }
  }

  //xoa ban
  async unfriend(inviter, friend) {
    try {
      // Xóa mối quan hệ bạn bè với nhiều người
      const request = await FriendsModel.deleteMany({
        $or: [{ "inviter.user": inviter }, { "friend.user": friend }],
      });

      const upRequest = await FriendsModel.updateMany(
        {
          $or: [
            { "inviter.user": inviter, state: "PENDING" },
            { "friend.user": friend, state: "PENDING" },
          ],
        },
        { $set: { state: "NOTYET" } },
      );

      return {
        status: 200,
        message: "Đã hủy kết bạn và cập nhật trạng thái thành NOTYET",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async search_without_rooms(params) {
    // Exception
    try {
      // Exception
      const finded = await FriendsModel.find({
        $and: [
          {
            $or: [
              {
                $and: [
                  { "inviter.nickname": params.search },
                  { "friend.user": params.inviter },
                ],
              },
              {
                $and: [
                  { "friend.nickname": params.search },
                  { "inviter.user": params.inviter },
                ],
              },
            ],
          },
          { state: "ACCEPTED" },
          { block: false },
        ],
      }).limit(params.limit);

      // If fineded
      if (finded) {
        return finded;
      }
      // Return
      return finded;
    } catch (error) {
      // Throw http exception
      throw new Error(error.message);
    }
  }
}
module.exports = new FriendsServices();
