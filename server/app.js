
const express = require("express");
const dotenv = require("dotenv");
const connectDatebase = require("./config/database");
const userRoutes = require("./routes/userRouter");
const chatRoutes = require("./routes/chatRouter");
const messageRoutes = require("./routes/messageRouter");
const {notFound , errorHandler} = require("./middleware/errorMiddleware");

dotenv.config();

connectDatebase();
const app = express();

app.use(express.json());













app.get("/" , (req , res) => {
    res.send("USER");
});

app.use("/user" , userRoutes);
app.use("/chat" , chatRoutes);
app.use("/message" , messageRoutes);














app.use(notFound);
app.use(errorHandler); 







const PORT = process.env.PORT;
const server = app.listen(PORT,console.log("server Started",PORT));

const io = require('socket.io')(server , {
    pingTimeout: 60000,
    cors : {
        origin : "http://localhost:3000",
    },
})

io.on("connection" , (socket) => {
    console.log("Connected to Socket.io");

    socket.on('setup' , (userData)=>{
        socket.join(userData._id)
        // console.log(userData._id);
        socket.emit('connected')
    })

    socket.on('join chat' , (room) => {
        socket.join(room)
        console.log("User Joined room " + room);
    })

    socket.on('typing' , (room) => socket.in(room).emit("typing"))
    socket.on('stop typing' , (room) => socket.in(room).emit("stop typing"))

    socket.on('new message' , (newMessagesRecieved) => {
        let chat = newMessagesRecieved.chat

        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if(user._id == newMessagesRecieved.sender._id) return;

            socket.in(user._id).emit("message received" , newMessagesRecieved);
        })
        
    })
})