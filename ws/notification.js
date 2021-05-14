const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('connect', socket.id)
        socket.send(socket.id);

        socket.on('disconnecting', () => {
            console.log('disconnect', socket.id)
        });

        socket.on("registerUser", (data) => {
            console.log(`ws getting`, data)
            socket.join(data['username']);
        });

        socket.on('notification', (data) => {
            console.log(`ws getting`, data)
            io.to(data.to).emit('send:notify', {
                ...data
            });
        });

    });

}

module.exports = {
    setupSocket
}
