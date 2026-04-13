const express=require('express');

const router=express.Router();



const {registerUser,LoginUser} = require('../../Controller/auth_controller.js')



router.post('/signup',registerUser);
router.post('/login',LoginUser);


module.exports=router;