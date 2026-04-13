const dotenv=require('dotenv');

dotenv.config();


module.exports={

    PORT:process.env.PORT,
    MONGO_URI:process.env.MONGO_URI,
    APP_NAME:process.env.APP_NAME,
    JWT_SECRET:process.env.JWT_SECRET

}