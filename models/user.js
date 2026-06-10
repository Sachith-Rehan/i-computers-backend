import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email : {
            type :String,
            unique : true,
            required : true
        },
        firstName : {
            type : String,
            required : true
        },
        lastName : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        isAdmin : {
            type : Boolean,
            default : false
        },
        isBlocked : {
            type : Boolean,
            default : false
        },
        isEmailVerified : {
            type : Boolean,
            default : false
        },
        Image : {
            type : String,
            required : true,
            default : "/default-profile.png"
        }    
    }
)

const User = mongoose.model("user" , userSchema);

export default User;