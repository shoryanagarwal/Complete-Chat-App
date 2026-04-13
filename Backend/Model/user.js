const mongoose=require('mongoose');

const bcrypt=require('bcrypt');
const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },

    email:{ // for auth purpose
         type:String,
        required:true,
        unique:true,
        tolowercase:true,

    },

    password:{

         type:String,
        required:true,
        

    },

    avatar: {
        type:String, // i will get the image url
        default:""
    },

    isOnline:{
        type:Boolean,
        default:false
    },

    lastSeen:{
        type:Date,
       
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },


   bio:{
    type:String,
    default:"Hey there! I am using Convofy Application."
   }



})

userSchema.pre('save',async function(next){

    if(!this.isModified("password") ){
        return next();
    }

    this.password = await bcrypt.hash(this.password,10);


})



const User =mongoose.model('User',userSchema);


module.exports=User;