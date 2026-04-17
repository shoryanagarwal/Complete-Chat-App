const express = require('express');
const app = express();
const { PORT } = require('./Config/server_config.js');
const connect = require('./Config/database_config.js');
const cors = require('cors');
const apiRoutes = require('./Route/index.js');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');

const Chat = require('./Model/chat.js');
const Message = require('./Model/message.js');

app.set('view engine', 'ejs');
app.set('views', './views');

const StartServer = async () => {

    try {

        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use('/api', apiRoutes);

        app.get("/", (req, res) => {
            res.send("Server is working");
        });

        app.get('/test-chat/:userId', (req, res) =>{
            res.render('chat', {
            chatId: "69dd33872543a7329060e171",
            user: { _id: req.params.userId }, // 
            messages: []    
    });
});

        
        const server = app.listen(PORT, () => {
            console.log(`server started successfully on ${PORT}`);
            connect();
        });

        
        const io = new Server(server, {
            pingTimeout: 60000,
            cors: {
                origin: "*"
            }
        });

       
        io.on('connection', (socket) => {
            console.log("socket connected ", socket.id);

            socket.on('disconnect', () => {
                console.log("user disconnected");
            });

            socket.on('setup', (userData) => {
                socket.join(userData._id);
                socket.emit('connected');
            });

            socket.on('join chat', (room) => {
                socket.join(room);
                console.log("user joined room ", room);
            });

            socket.on('new message', async (newMessage) => {
                try {
                    const { content, sender, chatId } = newMessage;

                    if (!content || !sender || !chatId) return;

                    let message = await Message.create({
                        sender: sender._id,
                        content,
                        chat: chatId
                    });

                    message = await message.populate('sender', 'username');
                    message = await message.populate('chat');

                    message = await Chat.populate(message, {
                        path: 'chat.users',
                        select: 'username'
                    });

                    await Chat.findByIdAndUpdate(chatId, {
                        latestMessage: message._id
                    });

                    socket.to(chatId).emit('message received', message);
                    socket.emit('message received', message);

                } catch (error) {
                    console.log("SOCKET ERROR:", error);
                }
            });
        });

    } catch (error) {
        console.log("unable to start server");
    }
};

StartServer();