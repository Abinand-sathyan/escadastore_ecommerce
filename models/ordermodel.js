const mongoose=require("mongoose")
const orderSchema=mongoose.Schema({
    Date:{
        type:String,
        require:true
    },
    
    Time:{
        type:String,
        require:true
    },

   UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    
    Products:[{
      productDedtails:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"addproduct"},
        quantity:{
             type:Number,
             default:1},
        total:{
             type:Number,
             default:0},
        }],
        total: {
            type: Number,
            required: true,
          },
          address: {
            Fname: String,
            Addressline: String,
            city: String,
            Country: String,
            State:String,
            Pincode: Number,
          },
          paymentMethod: {
            type: String,
            required: true,
          },
          paymentStatus: {
            type: String,
            required: true,
          },
          orderStatus: {
            type: String,
            required: true,
          },
          track:{
            type: String,
          },
          returnreason:{
            trpe:String,
          },
         useWallet:{
            type:Number,
          },
          couponDiscount:{
            type:Number,
          },
},{
    timestamps:true
});
const order=mongoose.model("Order",orderSchema)
module.exports=order;