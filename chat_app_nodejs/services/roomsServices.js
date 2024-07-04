const RoomsModel= require("../models/roomsModel");
const ConversationsServices = require("./conversationsServices"); 
const roomMembersService = require('./roomsMemberServices');

class RoomsServices {
  // Create Services
  async create(body) {
    // Exception
    try {
      // Create conversation
      const cvs_created = await ConversationsServices.create({ type: 'ROOMS' });

      // Check conversation is created
      if (cvs_created) {
        // Create Room
        const created_room = await RoomsModel.create({
          name: body.name,
          image: body.image,
          conversation: cvs_created._id,
          members_count: body.members.length + 1,
        });

        // Check created room
        if (created_room) {
          // Add members
          const add_room_members = await roomMembersService.create(
            created_room._id,
            body.creater,
            body.members,
          );

          // Return
          return add_room_members;
        }
      }
    } catch (error) {
      // Throw Error
      throw new Error(error.message);
    }
  }
}

module.exports = new RoomsServices();
