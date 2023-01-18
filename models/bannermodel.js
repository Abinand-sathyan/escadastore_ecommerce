const mongoose=require("mongoose")
const categoryschema=new mongoose.Schema({
    main_head: {
        type : String,
        required : true
    },
    sub_head: {
        type : String,
        required : true
    },
   
  
    ImageURL :{
        type : Array,
        required : true
    },
    route:{
        type: String
    },
    delete: {
        type:Boolean,
          default: false
    },
   
    offer: {
        type:Number,
          default: 0
    }
},{
    timestamps:true
})
let Banner=mongoose.model("Banner",categoryschema)
module.exports=Banner;