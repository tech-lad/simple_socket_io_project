const express = require("express")
const cors = require("cors")
const http = require("http")
const {Server} = require("socket.io")

const PORT = 5000;
const app = express()
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",  // this is the uri of the react(client)
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {

    // need to do some work of actual events

    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);    // data holds the roomId from client
        console.log(`User with id: ${socket.id} joined room: ${data}`)
    })
    socket.on("send_message", (msg) => {
        // here msg holds the message send by client
        socket.to(msg.room).emit("receive_message", msg)    
    })
    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.io);
    })
})

server.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`)
})