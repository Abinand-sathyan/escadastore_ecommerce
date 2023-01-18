const mongoose=require("mongoose")
const addproductschema=mongoose.Schema({
    ProductName:{
        type:String,
        require:true,
       },
    quantity:{
        type:Number,
        require:true,
    },
    Discription:{
        type:String,
        require:true,
    },
    Prize:{
        type:Number,
        require:true,
    },
    Size:{
        type:String,
        require:true,
    },
    Color:{
        type:String,
        require:true,
    },
    Category:{
        type:String,
        require:true,
    },
    ImageURL:{
        type:Array,
        require:true,
        },
    date: {
        type: String,
        default:Date.now
          },
         
    review:{
        type:Number,
         default:0
        },
    rating:{
        type:Number,
         default:0
        },
    offer:{
        type:Number,
        default: 0
        },
    discountPrice:{
        type:Number,
        default: 0
    } 
   },{
    timestamps:true
})
let AddProduct=mongoose.model("addproduct",addproductschema)
module.exports=AddProduct;
