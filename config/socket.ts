import { Socket } from "socket.io";

const { Server } = require("socket.io");

function socketServer(server: any) {
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000'],
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket: Socket) => {

        console.log("Connected to socket.io");
        var u: any
        socket.on("setup", (userData: any) => {
            socket.join(userData._id);
            u = userData._id
            socket.emit("connected");
        });

        socket.on('join chat', (room) => {
            socket.join(room);
            console.log('user joined Room: ' + room);
        })

        socket.on("typing", (room) => socket.in(room).emit("typing"));
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));


        socket.on("new message", (newMessageReceived) => {
            var chat = newMessageReceived.chat;

            if (!chat.users) return console.log('chat.users not defined');

            chat.users.forEach((user: any) => {
                if (user._id == newMessageReceived.sender._id) return;

                socket.in(user._id).emit("message recieved", newMessageReceived);
            })
        })

        socket.off("setup", () => {
            console.log('User disconnected');
            socket.leave(u);
        })
    });


}

export default socketServer;
