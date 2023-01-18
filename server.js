const mongoose=require('./config/connection')
const app=require('./app')

mongoose
     .then(()=>{
        console.log("data base connected");
     })
     .catch((err)=>{
        console.log("err in db"+err)
     })

     const PORT=process.env.PORT 


   app.listen(PORT,(error)=>{
    if(error){
        console.log("server occured"+error);

    }
    else{
        console.log(`server running started at ${PORT}`);
    }
   })