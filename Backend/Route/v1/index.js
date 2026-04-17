const express=require('express');

const router=express.Router();

const authMiddleware=require('../../Middleware/AuthMiddleware.js');

const {registerUser,LoginUser} = require('../../Controller/auth_controller.js')

const {oneOnOneChat,userChat}=require('../../Controller/chatcontroller.js')
const {sendMessage,getMessage}=require('../../Controller/message_controller.js')

router.post('/signup',registerUser);
router.post('/login',LoginUser);


router.post('/chat/oneonone',authMiddleware,oneOnOneChat);
router.get('/chat',authMiddleware,userChat);

router.post('/message',authMiddleware,sendMessage);
router.get('/message/:chatId',getMessage);



module.exports=router;