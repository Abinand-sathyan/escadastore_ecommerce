const session=(req,res,next)=>{
    if(req.session.adminlogin) {
        next()
    }else{
        res.redirect("/admin")
    }
}
module.exports=session;
