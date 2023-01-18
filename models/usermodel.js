const mongoose = require("mongoose");
const bcrypt=require('bcrypt') 
const UserSchema=new mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email_address:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirm_password:{
        type:String,
        required:true
    },
    mobile_number:{
        type:Number,
        required:true
    },
    block:{
      type:Boolean,
      default:true
    },
    useWallet:{
        type:Number,
        default:0
      },

});
let user=mongoose.model('User',UserSchema)
module.exports=user;
