const mongoose=require('mongoose');


const messageSchema=mongoose.Schema({


    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat',
        required:true
    },


    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },

    content:{
        type:String,
        required:true,
        trim:true
        
    },


    messageType:{
        type:String,
        enum:['text','image','video','file'],
        default:'text'



    },

    status:{
        type:String,
        enum:['sent','delivered','read'],
        default:'sent'
    }








},{ timestamps: true })



const Message= mongoose.model('Message',messageSchema);

module.exports=Message