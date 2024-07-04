const { Server } = require("socket.io");
const messagesServices = require("../services/messagesServices");
const FriendsService = require("../services/friendsServices");
const express = require("express");
const http = require("http");
const cors = require("cors");
const corsConfig = require("../config/cors");
const conversationsServices = require("../services/conversationsServices");
const SOCKET_PORT = process.env.SOCKET_PORT;

const socketApp = express();

// Cors Config
socketApp.use(cors(corsConfig));

// Http Server
const socketServer = http.createServer(socketApp);

// Create Socket server
const io = new Server(socketServer, { cors: corsConfig });

// Using middleware
io.use((socket, next) => {
  // User ID
  const user = socket?.handshake?.auth?.user;

  // Check user is valid
  if (!user) {
    return next(new Error("Người dùng không tồn tại"));
  }
  // Set socket user
  socket.user = user;

  // Next
  next();
});

const connectSocket = () => {
  // Socket disconnect
  io.on("disconnect", () => {
    // Users list
    const users = [];

    // For loop
    for (const [id, socket] of io.of("/").sockets) {
      // Push to user
      users.push({
        clientID: id,
        user: socket?.user,
      });
    }

    // Users
    io.emit("users", users);
  });

  // Socket connection event
  io.on("connection", (client) => {
    // Users list
    const users = [];

    // For loop
    for (const [id, socket] of io.of("/").sockets) {
      // Push to user
      users.push({
        clientID: id,
        user: socket?.user,
      });
    }

    // Users
    io.emit("users", users);

    // Chat Event
    client.on("chat:server", async (data) => {
      // Message
      const message = await messagesServices.chats(data);

      // Send
      io.emit("chat:client", message);
    });

    // Chat Event
    client.on("chat.actions:server", async (data) => {
      // Exception
      try {
        // Check swicth
        switch (data.action) {
          case "UNMESSAGE":
            // Message
            await messagesServices.unmessage(data.message);

            // Send to client
            io.emit("chat.actions:client", {
              message: {
                ...data.message,
                state: "NONE",
              },
              action: "UNMESSAGE",
            });
            break;
          case "DELETE":
            // Message deleted
            await messagesServices.delete(data.message);

            // Send to client
            io.emit("chat.actions:client", {
              message: {
                ...data.message,
                state: "RECEIVER",
              },
              action: "DELETE",
            });
            break;
          case "TRANSFERT":
            // Message deleted
            const transf = await messagesServices.transfert(data.message);

            // Send to client
            io.emit("chat.actions:client", {
              message: transf,
              action: "TRANSFERT",
            });
            break;
          case "PIN":
            // Message deleted
            await conversationsServices.pin(data.message);

            // Send to client
            io.emit("chat.actions:client", {
              message: data.message,
              action: "PIN",
            });
            break;
        }
      } catch (error) {
        // Throw eror
        throw new Error(error.message);
      }
    });

    // Friend actions
    client.on("friend:server", async (body) => {
      // Exception
      try {
        // Created
        const created = await FriendsService.send(body);

        // Emit socket
        io.emit("friend:client", created);
      } catch (error) {
        // throw ws exception
        throw new Error(error.message);
      }
    });

    // Friend actions
    client.on("friend.actions:server", async (body) => {
      // Exception
      try {
        // Check friend actions
        if (body.action === "ACCEPT") {
          // Update
          const updated = await FriendsService.accept(body);

          // Emit socket
          io.emit("friend.actions:client", updated);
        } else {
          // Update
          const deleted = await FriendsService.cancel(body);

          // Emit socket
          io.emit("friend.actions:client", deleted);
        }
      } catch (error) {
        // throw ws exception
        throw new Error(error.message);
      }
    });

    client.on("call:answer", async (body) => {
      // Exception
      try {
        // Find
        const find = Array.from(io.of("/").sockets.values()).find(
          (sk) => sk?.user === body.to,
        );

        // Check to
        if (find) {
          // Emit socket
          io.to(find?.id).emit("call:accepted", body.signal);
        } else {
          // throw ws exception
          throw new Error("Không tìm thấy người dùng");
        }
      } catch (error) {
        // throw ws exception
        throw new Error(error.message);
      }
    });

    client.on("call:to", async (body) => {
      // Exception
      try {
        // Find
        const find = Array.from(io.of("/").sockets.values()).find(
          (sk) => sk?.user === body.to?.user,
        );

        // Check to
        if (find) {
          // Emit socket
          io.to(find?.id).emit("call:from", {
            signal: body.signalData,
            from: body.from,
            name: body.name,
          });
        } else {
          // throw ws exception
          throw new Error("Không tìm thấy người dùng");
        }
      } catch (error) {
        // throw ws exception
        throw new Error(error.message);
      }
    });

    client.on("call:to:end", (body) => {
      // Exception
      try {
        // Find
        const find = Array.from(io.of("/").sockets.values()).find(
          (sk) => sk?.user === body.to,
        );

        // Check to
        if (find) {
          // Emit socket
          io.to(find?.id).emit("call:from:end", {
            from: body.from,
            name: body.name,
          });
        } else {
          // throw ws exception
          throw new Error("Không tìm thấy người dùng");
        }
      } catch (error) {
        // throw ws exception
        throw new Error(error.message);
      }
    });
  });
};

// Socket connection port
socketServer.listen(SOCKET_PORT);

module.exports = connectSocket;
