const jwt =require('jsonwebtoken')


const authMiddleware= (req,res,next)=>{
    
    try {
        const header = req.headers.authorization.split(" ")[1];
        
        
        if(!header){
            return res.status(401).json({
                success:false,
                message:"Unauthorized"
            })
        }   
            
    
        const decode=jwt.verify(header,process.env.JWT_SECRET) // verify token and decode it to get user id
    
        req.user=decode
    
        next();
    
    } 
    
    catch (error) {
        
        return res.status(401).json({
            success:false,
            message:"Unauthorized"
        })
        
    }




}

module.exports=authMiddleware