const express = require("express")
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, { cors: { origin: '*' } })
const { v4: uuidv4 } = require('uuid');

app.use('/peerjs', require('peer').ExpressPeerServer(server, {debug: true}))

io.on('connection', socket => {
    socket.on('join-room', (room_id, user_id) => {
        if (!room_id) room_id = uuidv4()
        socket.join(room_id)
        socket.broadcast.to(room_id).emit('user-connected', user_id) //send broadcast message to all user in the same room
        socket.emit('room-joined', room_id)

        socket.on('disconnect', () => {
            socket.broadcast.to(room_id).emit('user-disconnected', user_id)
            socket.leave(room_id)
        })
        socket.on('quit-room', () => {
            socket.broadcast.to(room_id).emit('user-disconnected', user_id)
            socket.leave(room_id)
            socket.emit('quit-done')
        })
    })

})

server.listen(5000, () => {
    console.log("express server listen to the port 5000")
})




// app.listen creates an http server for us 
// require :returns whatever is exported (objects, functions ...) 