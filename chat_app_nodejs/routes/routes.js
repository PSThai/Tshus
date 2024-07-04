
const usersRoute = require("../routes/usersRoute");
const authRoute = require("../routes/authRoute");
const chatsRoute = require("../routes/chatsRoute");
const messagesRoute = require("../routes/messagesRoute");
const conversationsRoute = require("../routes/conversationsRoute");
const friendsRoute = require("../routes/friendsRoute");
const roomsRoute = require("../routes/roomsRoute");
const roomMembersRoute = require("../routes/roomMembersRoute");

const routes = (app) => {
  // [ROUTE] /users
  app.use("/users", usersRoute);

  // [ROUTE] /chats
  app.use("/chats", chatsRoute);

  // [ROUTE] /messages
  app.use("/messages", messagesRoute);

  // [ROUTE] /messages
  app.use("/conversations", conversationsRoute);

  // [ROUTE] /messages
  app.use("/friends", friendsRoute);

  // [ROUTE] /rooms
  app.use("/rooms", roomsRoute);

  // [ROUTE] /roommembers
  app.use("/roommembers", roomMembersRoute);

  // [ROUTE] /auth
  app.use("/auth", authRoute);
};

module.exports = routes;
