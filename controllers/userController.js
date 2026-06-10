import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export async function createUser(req , res){
    
    try{
        const user = await User.findOne({Email : req.body.Email});

        if(user != null){
            res.json({message : "user already exists"});
            return;
        }

        const passwordHash = bcrypt.hashSync(req.body.password , 10);
        //create user
        const newUser = new User({
            email : req.body.email,
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            password : passwordHash
        })

        await newUser.save();
        res.json({message : "user created successfully"});

    }catch(error){
        res.json({message : error.message});
    }
        
}

export async function loginUser(req , res){
    try{ 
        const email = req.body.email;
        const password = req.body.password;

        if(!email || !password){
            res.json({message : "email and password are required"});
            return;
        }

        const user = await User.findOne({email : email});

        if( user == null){
            res.status(404).json({message : "user not found"});
            return; 
        } 

        const isPasswordValid = bcrypt.compareSync(password , user.password);

        if(isPasswordValid){
            const token = jwt.sign(
                {
                    email : user.email,
                    firstName : user.firstName,
                    lastName : user.lastName,
                    isAdmin : user.isAdmin,
                    isBlocked : user.isBlocked,
                    isEmailVerified : user.isEmailVerified,
                    Image : user.Image
                },
                "secretKey"
            )

            res.json({message : "login successful" , token : token});
        }else{
            res.status(401).json({message : "invalid password"});
        } 

    }catch(error){
        res.json({message : error.message});
    }        

}