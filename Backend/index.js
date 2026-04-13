const express=require('express');

const app=express();
const {PORT}=require('./Config/server_config.js')
const connect = require('./Config/database_config.js');
const cors=require('cors');
const apiRoutes=require('./Route/index.js')
const bodyParser=require('body-parser');


const StartServer=async()=>{


    try {


        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded(
            {extended:true}
        ))
        app.use('/api',apiRoutes);
        app.get("/", (req, res) => {
            res.send("Server is working");
        });
        
        app.listen(PORT,()=>{
            console.log(`server started successfully on ${PORT}`);
            connect();

            
        })
    
    } 
    
    
    catch (error) {
        console.log("unable to start server");
        
    }



}

StartServer();
