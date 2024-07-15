"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Server } = require("socket.io");
function socketServer(server) {
    const io = new Server(server, {
        cors: {
            origin: [process.env.CORS_URL],
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        console.log("Connected to socket.io");
        var u;
        socket.on("setup", (userData) => {
            socket.join(userData._id);
            u = userData._id;
            socket.emit("connected");
        });
        socket.on('join chat', (room) => {
            socket.join(room);
            console.log('user joined Room: ' + room);
        });
        socket.on("typing", (room) => socket.in(room).emit("typing"));
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
        socket.on("new message", (newMessageReceived) => {
            var chat = newMessageReceived.chat;
            if (!chat.users)
                return console.log('chat.users not defined');
            chat.users.forEach((user) => {
                if (user._id == newMessageReceived.sender._id)
                    return;
                socket.in(user._id).emit("message recieved", newMessageReceived);
            });
        });
        socket.on("new notifications", (newNotifications, userId) => {
            console.log('new notifications are arrived...');
            socket.in(userId).emit('receivedNotifications', newNotifications);
        });
        socket.off("setup", () => {
            console.log('User disconnected');
            socket.leave(u);
        });
    });
}
exports.default = socketServer;
//# sourceMappingURL=socket.js.map