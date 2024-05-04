const { Server } = require("socket.io");

function socketServer(server: any) {
    const io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000'],
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket: any) => {

        console.log('New user connected');

        socket.on('sendMessage', (message: any) => {
            io.emit('message', message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });


}

export default socketServer;
