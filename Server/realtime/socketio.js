const socketio = require('socket.io');

module.exports = function (server) {
    const io = socketio(server);

    io.on('connection', async (socket) => {
        // Log when user connect
        const user = socket.handshake.query.user;
        const room = socket.handshake.query.room;

        console.log(user + " just connected");
        socket.join(room);
        // Get all the connected clients
        let clients = io.sockets.clients().connected;
        let clientNames = [];
        Object.keys(clients).map((key) => {
            clientNames.push(clients[key].handshake.query.user)
        })

        // Gets all stored messges from the databases and sends
        // them when a user connects
        // let messages = await chat.getMessages();
        // socket.emit('message', messages);

        // Disconnects a user
        socket.on('disconnect', function () {
            console.log(user + " disconnected");
        });

        // Clients sends message
        socket.on('message', (message) => {
            io.to(room).emit('message', { user: message.user, message: message.message, you: false });
            // chat.addMessage(message.user, message.message);
        });

        // Client is typing
        socket.on("typing", () => {
            socket.to(room).broadcast.emit("typing", { user: user, typing: true });
        })

        // Client stoped typing
        socket.on("notTyping", () => {
            socket.to(room).broadcast.emit("typing", { user: user, typing: false });
        })
    });
}