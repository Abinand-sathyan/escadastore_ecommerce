const mongoose=require("mongoose")
const addresschema=new mongoose.Schema({
    User:{type:mongoose.Schema.Types.ObjectId,
          ref:"User"},
 Address:[{
    Fname:{
          type:String,
          require:true},

    Pincode:{
          type:Number,
          required:true},
   
    Addressline:{
        type:String,
        required:true},
          
    city:{
        type:String,
        require:true},
        
    State:{
        type:String,
        require:true},

    Country:{
        type:String,
        require:true},    

        }]     
})
const Address=mongoose.model("address",addresschema)
module.exports=Address;
