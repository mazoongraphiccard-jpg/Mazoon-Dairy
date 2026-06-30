const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = {};
let messages = [];

app.use(express.static("public"));

io.on("connection", (socket) => {

  socket.on("join", (name) => {
    users[socket.id] = name;
    io.emit("users", users);
    socket.emit("messages", messages);
  });

  socket.on("message", (msg) => {
    const data = {
      id: socket.id,
      user: users[socket.id],
      text: msg,
      time: Date.now()
    };
    messages.push(data);
    io.emit("message", data);
  });

  // private message
  socket.on("private", ({to, text}) => {
    io.to(to).emit("private", {
      from: users[socket.id],
      text
    });
  });

  // kick user
  socket.on("kick", (id) => {
    io.to(id).emit("kicked");
    io.sockets.sockets.get(id)?.disconnect();
  });

  // clear chat
  socket.on("clear", () => {
    messages = [];
    io.emit("messages", []);
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", users);
  });

});

server.listen(3000, () => {
  console.log("Mazoon Chat running on http://localhost:3000");
});