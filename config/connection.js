const mongoose=require('mongoose')
const dotenv=require('dotenv')

dotenv.config({path:'./.env'})
DB=process.env.DATABASE_LOCAL
console.log(DB);

const mongoosedb=mongoose.connect(DB, {
    useNewUrlParser: true, 
 useUnifiedTopology: true 
    
})
module.exports=mongoosedb