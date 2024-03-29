const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const http = require("http");
const PORT = process.env.PORT || 4000;

//Kafka proxy
const KafkaProxy = require('kafka-proxy');
let kafkaProxy = new KafkaProxy({
  wsPort: 9999, 
  kafka: 'localhost:9092/',
  crossOriginIsolated: true
});
kafkaProxy.listen();

const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, {
  // options
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

const roomsList = [388, 152, 357, 206, 411, 439, 369, 339, 169];

(() => {
  try {
    app.use(cors());

    app.use("/", (req, res) => {
      res.send(`Hola Mundo. Transmitiendo eventos a través de Socket IO cada 30 segundos`);
    });
    let reps = 15;

    io.on("connection", (socket) => {
      console.log(`New connection: ${socket.id}`);

      //Emit fall risk each 30 sec
      setInterval(() => {
        let number = Math.floor(Math.random() * 3);
        let roomIndex = Math.floor(Math.random() * 9);

        //socket.emit(`room ${roomsList[roomIndex]}`, {'FallRisk': number});
        socket.emit('fallRisk', {'room': roomsList[roomIndex], 'FallRisk': number})

        console.log({'room': roomsList[roomIndex], 'FallRisk': number});
      }, 30000);

      socket.on("chat", (msg) => {
        console.log(`Chating: ${msg}`);
      });

      //receive audio 
      socket.on('audio', (obj)=>{
        console.log(`Audio recibido`)

        socket.broadcast.emit('audio', obj)
      })

      //receive any event
      // socket.onAny((event, msg) => {
      //   console.log(`Event: ${event} - Msg: ${msg}`);
      // });
    });

    server.listen(PORT, () =>
      console.log(`Listening on: http://localhost:${PORT}`)
    );
  } catch (e) {
    console.log(e);
  }
})();
