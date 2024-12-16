import express from 'express';
import { Server } from 'socket.io';

const app = express();
const PORT = 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
  },
});

let users = [];

io.on('connection', (socket) => {
  console.log("A user connected");

  socket.on("new-user-joined", (newUser) => {
    users.push({ id: socket.id, name: newUser });
    socket.broadcast.emit("user-joined", { name: newUser }); 
  });

  socket.on("send-message", (message) => {
    io.emit("receive-message", message); 
  });

  socket.on('disconnect', () => {
    const user = users.find((user) => user.id === socket.id);
    if (user) {
      users = users.filter((user) => user.id !== socket.id);
      socket.broadcast.emit("user-left", { name: user.name }); 
    }
  });
});
