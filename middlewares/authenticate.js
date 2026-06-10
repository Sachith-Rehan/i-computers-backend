import jwt from "jsonwebtoken";
    export default function authenticate(req,res,next){
        const header = req.header("Authorization");
        
        
        if(header == null){
            next();
        }else{
            const token = header.replace("Bearer " , "");
            console.log(token);

            jwt.verify(token , "secretKey" , 
                (err , decoded) => {
                    
                    if(decoded == null){
                        res.status(401).json({message : "invalid token"});
                        return;
                    }else{
                        req.user = decoded;
                        next();
                    }
                }
            )

        }
    }    