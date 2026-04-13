const Chat=require('../Model/chat.js');


// 1 on 1 chat


const oneOnOneChat=async(req,res)=>{
    console.log(req.body);
    
    try {
        const {userId} = req.body;
        
       
        

        if(!userId){
            return res.status(400).json({
                success:false,
                message:"UserId is required",
                data:{}


            })
        }

        // checking for existing chat

        
        
        let chat =await Chat.findOne({

            
            isGroupChat:false,
            users:{$all:[req.user._id,userId]}




        }).populate("users","-password").populate("latestMessage");
        
        if(chat){

            return res.status(200).json({

                success:true,
                message:"Chat already exists",
                data:chat


            })


        }
        console.log("hi");
        
        

        // if chat does not exist create a new chat
        console.log(req.user.id);
        
        const newChat= await Chat.create({
            chatName:'',
            isGroupChat:false,
            users:[req.user.id,userId]
        })

        console.log(newChat);
        

        
        


        const fullChat = await Chat.findOne({_id:newChat._id}).populate("users","-password")

        res.status(201).json({
            success:true,
            message:"Chat created successfully",
            data:fullChat
        })



    } 
    
    
    catch (error) {
        
        console.log("error occured during one on one chatting");
        return res.status(500).json({
            message:"Internal Server Error",
            err:error,
            data:{},
            success:false
        })
        
    }



}



// now for group chat


const groupChat=async(req,res)=>{

    try {

        const {name,users} = req.body;

        if(!name || !users){
            return res.status(400).json({
                success:false,
                message:"Name and users are required",
                data:{}
            })
        }

        const groupUser=JSON.parse(users);

        if(groupUser.length<2){
            return res.status(400).json({
                success:false,
                message:"At least 2 users are required to create a group chat",
                data:{}

            })
        }

        groupUser.push(req.user._id);

        const newGroupChat= await Chat.create({
            chatName:name,
            isGroupChat:true,
            users:groupUser,
            groupAdmin:req.user._id
        })


        const fullGroupChat = await Chat.findOne({
            _id:newGroupChat._id

        }).populate("users","-password").populate("groupAdmin","-password")

        res.status(200).json({
            success:true,
            message:"Group chat created successfully",
            data:fullGroupChat
        })

        
    } 
    
    catch (error) {
        console.log("error occured during group chatting");
        return res.status(500).json({
            message:"Internal Server Error",
            error:error,
            data:{},
            success:false
        })
        
    }


}



const userChat=async(req,res)=>{
    

    try {

        const chat = await Chat.find({
            users:{$in:[req.user.id]}
        })
        .populate("users","-password") 
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .sort({updatedAt:-1}) 

        return res.status(200).json({
            success:true,
            message:'user chats fetched succesfully',
            data:chat
        })
    } 
    
    
    catch (error) {
        
        console.log('error while fetching data of user');
        res.status(500).json({
            data:{},
            success:false,
            message:'error while fetching data of user',
            err:error

        })
        
        
    }


}


module.exports={
    oneOnOneChat,
    groupChat,
    userChat
    
}