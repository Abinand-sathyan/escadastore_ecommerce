const mongoose = require("mongoose");
const cartschema=new mongoose.Schema({
    code : {
        type : String,
        required : true
    },
    cutOff: {
        type : Number,
        required : true
    },
    timeStamp :{
        type : Date,
        default : new Date()
    },
    status : {
        type : String,
        default : 'ACTIVE'
    },
    couponType:{
        type:String,
        required:true
    },
    maxRedeemAmount : {
        type : Number,
        required : true
    },
    minCartAmount : {
        type : Number,
        required : true
    },
    generateCount : {
        type : Number,
        required : true
    },
    expireDate : {
        type : Date,
        require : true
    }

})
const coupon=mongoose.model("Coupon",cartschema)
module.exports=coupon;