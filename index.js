const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const http = require("http");
const PORT = process.env.PORT || 4000;

const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  // options
  cors:{
    origin: ['http://localhost:3000']
  }
});

(() => {
  try {
    app.use(cors());

    app.use("/", (req, res)=>{
      res.send(`Hola Mundo`)
    })

    app.use("/send", (req,res)=>{
      io.emit('chat', 'Sending message from server')
      console.log("Sending msg from server")
    })

    io.on("connection", (socket) => {
      console.log(`New connection: ${socket.id}`);

      socket.on("chat", (msg) => {
        console.log(`Chating: ${msg}`);
      });

      socket.on("room352", (msg) => {
        console.log(`Receving message from room 352: ${msg}`);
        socket.emit('chat', 'Message from socketio')
      });

      socket.onAny((event, msg) => {
        console.log(`got ${event} and msg: ${msg}`);
      });
    });

    server.listen(PORT, () => console.log(`Listening on: http://localhost:${PORT}`));
  } catch (e) {
    console.log(e)
  }
})();
