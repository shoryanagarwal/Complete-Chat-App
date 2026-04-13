const User = require('../Model/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_SECRET}=require('../Config/server_config.js')

const registerUser=async(req,res)=>{
    
    try {
        const {username,email,password}=req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
            success: false,
            message: "All fields are required",
            });
        }



        //if user already exist 
        

        const existingUser = await User.findOne({
            $or:[
                {email:email},
                {username:username}
            ]
        });
        
        if(existingUser){

            return res.status(400).json({
                success:false,
                message:'user already exist with this email',
                data:{}
            })

        }


        // if not then create the user
        
        const newUser = await User.create(req.body)

        newUser.password = undefined;

        return res.status(201).json({
            success:true,
            message:'user created successfully',
            data:newUser,
            err:{}
        })


    } 
    
    catch (error) {
        console.log(error);
        
        console.log('error in creating the user');
        res.status(500).json({
            success:false,
            message:'unable to create the user',
            data:{},
            err:error
        })
        
        
    }


}



const LoginUser = async(req,res)=>{

    try {
        
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({
                success:false, 
                message:'All fields are required',
                
            })
        }

        const user = await User.findOne({email:email});

        if(!user){
            return res.status(404).json({
                success:false,
                message:'user not found with this email'
            })
        }

        //matching the password
        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:'invalid credentials'
            })
        }

        //else generate the jwt and sent to the user

        const token= jwt.sign(
            {id: user._id},
            JWT_SECRET,
            {expiresIn:'7d'}
        )


        user.password=undefined;
        return res.status(200).json({
            success:true,
            message:'user logged in successfully',
            data:{user,token},
            err:{}
        })


    } 
    
    catch (error) {
    
        console.log('error while Login');

        return res.status(500).json({
            success:false,
            message:'unable to login',
            data:{},
            err:error
        })
        

    }






}



module.exports={
    registerUser,
    LoginUser
}