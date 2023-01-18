const mongoose = require("mongoose");
const cartschema=new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    items:[{
        productDedtails:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"addproduct"  
        },
        quantity:{
            type:Number,
            default:1
        },
       total:{
            type:Number,
            default:1
        },
        date:{
            type:Number,
            default:1
        }
    }],
    totalCart:{
        type:Number,
        default:0
    }
})
const Cart=mongoose.model("cart",cartschema)
module.exports=Cart;