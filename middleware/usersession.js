const { render } = require("ejs")
const User=require("../models/userModel")
const usersession =async(req,res,next)=>{
if(req.session.LoggedIn)
{
    next()
}
else{
    res.redirect("/userlogin")
}
}

const checkBlock=async(req,res,next)=>{
     const Blockcheck= await User.findOne({_id:req.session.user._id})
    if(Blockcheck.block)
    {
        next()
    }
    else{
        res.render("user/blocked")
    }
}



module.exports={
    usersession,
    checkBlock
}

