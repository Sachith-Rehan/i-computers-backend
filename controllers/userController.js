import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


export async function createUser(req , res){
    
    try{
        const user = await User.findOne({email : req.body.email});

        if(user){
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

// export async function createUser(req, res) {
//     try {

//         const user = await User.findOne({
//             email: req.body.email
//         });

//         console.log("Found user:", user);

//         if (user) {
//             return res.status(400).json({
//                 message: "user already exists"
//             });
//         }

//         const passwordHash = bcrypt.hashSync(
//             req.body.password,
//             10
//         );

//         const newUser = new User({
//             email: req.body.email,
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             password: passwordHash
//         });

//         await newUser.save();

//         res.status(201).json({
//             message: "user created successfully"
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         });
//     }
// }

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
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn : "24h"
                }
            )

            res.json({message : "login successful" , token : token , isAdmin : user.isAdmin});
        }else{
            res.status(401).json({message : "invalid password"});
        } 

    }catch(error){
        res.json({message : error.message});
    }        

}

export async function getUser(req, res) {
    if(req.user == null) {
        res.status(401).json({message: "unaythorized"})
        return
    }

    try{
        const email = req.user.email;

        const user = await User.findOne({email : email})

        if(user == null) {
            res.status(404).json({message: "not found!"})
            return
        }

        if(user.isBlocked){
            res.status(403).json({message: "user is blocked!"})
            return
        }

        res.json({email : user.email, firstName: user.firstName, lasrName: user.lastName, isAdmin: user.isAdmin, image: user.image, isEmailVerified: user.isEmailVerified})
         
    }catch(err){
        res.json({message : err.message})
    }
}

export async function changePassword(req, res) {
    if(req.user == null){
        res.status(401).json({message: "unaythorized"})
        return
    }

    const password = req.body.password
    const passwordHash = bcrypt.hashSync(password, 10)

    try{
        const email = req.user.email
        await User.updateOne({email : email}, {password : passwordHash})
    }catch(err){
        res.json({message : err.message})
    }
}


export async function updateProfile() {
    if(req.user == null){
        res.status(401).json({message: "unaythorized"})
        return
    }
    
    try{
        const email = req.user.email

        const user = User.updateOne({email: email}, {firstName: req.body.firstName, lastname: req.body.lastName, image: req.body.image})

        res.json({message: "Profile updated succssfully"})
        return
    }catch(err){
        console.log({message: err.message})
    }   
}