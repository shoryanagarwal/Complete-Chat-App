const {Server}=require('socket.io')
const {PORT}=require('../Config/server_config.JS')
const express=require('express');
const app=express();

const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
const connectDB=require('../Config/database_config.js')

const Chat=require('../Model/chat.js')
const Message=require('../Model/message.js');





connectDB();

const io= new Server(server,{
    pingTimeout:60000, // if user does not reonnect within 60 seconds, they will be disconnected

    cors:{              // allow frontend to connect to backend
        origin:'*'  
    },
})

io.on('connection',(socket)=>{
    console.log("socket connected ",socket.id);

    
        socket.on('disconnect',()=>{
            console.log("user disconnected ")
        })

        socket.on('setup',(userData)=>{
            socket.join(userData._id) // join the user to a room with their id, so we can send them messages
            socket.emit('connected')
        })


        socket.on('join chat',(room)=>{
            socket.join(room) // join the user to a room with the chat id, so we can send them messages
            console.log("user joined room ",room);
        })


        socket.on('new message',async(newMessage)=>{
            try {
                const {content,sender,chatId}=newMessage
                
                if(!content ||!sender ||!chatId){
                    return
                }


                let message= await Message.create({
                    sender:sender._id,
                    content:content,
                    chat:chatId
                })
                

                 message=await message.populate('sender','username')

                 message= await message.populate('chat');


                 message= await Chat.populate(message,{
                    path:'chat.users',
                    select:'username'
                 })


                 //updating the latest message in the chat
                 await Chat.findByIdAndUpdate(chatId,{
                    latestMessage:message._id
                 })


                 //send to all 
                 socket.to(chatId).emit('message received',message)

                 socket.emit('message received',message)

    
            } 
            
            
            catch (error) {
                
            }


        })


})


