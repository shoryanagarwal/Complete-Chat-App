const Message = require('../Model/message.js')
const Chat = require('../Model/chat.js');




const sendMessage = async(req,res)=>{

    try {
        console.log(req.user);
        
        
        const {content,chatId} = req.body;

        if(!content || !chatId){
            return res.status(400).json({
                success:false,
                message:"Content and chatId are required",
                data:{}
            })
        }


        
        let newMessage=await Message.create({
            sender:req.user.id,
            content,
            chat:chatId,

        })

        console.log(newMessage);

        console.log("before populate");
        
        

        newMessage=await newMessage.populate("sender", "username avatar"); // populating sender details
        
        console.log(newMessage.chat);
        
       
        
        
        newMessage=await newMessage.populate({ // populating chat users details
             path: "chat",
                populate: {
                    path: "users",
                    select: "username avatar"
                } // fields to select 
        })
        console.log(newMessage);
        

        await Chat.findByIdAndUpdate(chatId,{
            latestMessage:newMessage._id // updating latest message in chat
        })



    return res.status(201).json({
      success: true,
      data: newMessage,
    });



    }

    
    
    
    catch (error) {
        
        return res.status(500).json({
      success: false,
      message: error.message,
    });
    
    
    }



}


const getMessage = async(req,res)=>{

    try {
        const {chatId} =req.params;
        let message= await message.find({
            chat:chatId
        })
        .populate('sender','avatar username')
        .populate('chat')

        return res.status(200).json({
            success:true,
            message:'messages fetched successfully',
            data:message
        })

    } 
    
    
    catch (error) {

        return res.status(500).json({
            success:false,
            message:error.message,
            data:{},
            err:error
        })

    }


}


module.exports ={
    sendMessage,
    getMessage
}