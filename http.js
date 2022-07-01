const http = require("http");
const PORT = process.env.PORT || 4000;

const { Server } = require("socket.io");
const httpServer = http.createServer();
const io = new Server(httpServer, {
  // options
  cors:{
    origin: ['http://localhost:3000']
  }
});

io.on("connection", (socket) => {
  // ...
  console.log(`New connection: ${socket.id}`);
});

httpServer.listen(PORT, () => console.log(`Listening on: http://localhost:${PORT}`));