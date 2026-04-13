const mongoose= require('mongoose');

const {MONGO_URI,APP_NAME} =require('./server_config.js')



const connect=async ()=>{

    try {

        let repsonse=await mongoose.connect(MONGO_URI,{
            dbName:APP_NAME
        })

        console.log("mongodb connected successfully");

        return repsonse;
    } 
    
    catch (error) {
    
        console.log('unable to connect to the server');
        

    }


}


module.exports=connect;