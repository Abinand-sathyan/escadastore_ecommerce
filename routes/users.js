const productDB = require("../models/addproductmodel");
const {pagenation}=require("../middleware/pagination")
const {usersession,checkBlock}=require("../middleware/usersession")
var express=require('express')
var router=express.Router();
var{postUserhome,
    getUserhome,
    getUserSignUp,
    getUserregister,
    postotp,
    otp,
    getproductdetails,
    userlogin,
    getviewcart,
    getproducts,
    postviewcart,
    changequantity,
    deletecartproduct,
    getprofile,
    getaddress,
    addresdetails,
    deleteaddress,
    geteditaddress,
    getcheckout,
    userlogout,
    payment,
    PostEditaddress,
    ordersucecss,
    getorderlist,
    orderdetials,
    verifycoupon,
    cancellorder,
    refundorder,
    createorder,
    veryfypayment,
    productreview,
    geterrorpage}=require("../controllers/usercontroler")


    //get methods
    
    router.get("/",getUserhome);
    router.get("/userlogin",userlogin);
    router.get("/usersignup",getUserSignUp);
    router.get("/logout",userlogout);
    router.get("/getproductdetails/:id",usersession,checkBlock,getproductdetails);
    router.get("/getviewcart",usersession,getviewcart);
    router.get("/products",pagenation(productDB),getproducts);
    router.get("/otp",otp);
    router.get("/profile",usersession,checkBlock,getprofile);
    router.get("/address",usersession,checkBlock,getaddress);
    router.get("/editaddress/:id",usersession,checkBlock,geteditaddress);
    router.get("/getcheckout",usersession,checkBlock,getcheckout);
    router.get("/order-sucecss",usersession,checkBlock,ordersucecss);
    router.get("/orderlist",usersession,checkBlock,getorderlist);
    router.get("/orderdetails/:id",usersession,checkBlock,orderdetials)
    router.get("/errorpage",usersession,checkBlock,geterrorpage);
   
    
   


    //post methods
    
    router.post("/register",getUserregister);
    router.post("/gethome",postUserhome);
    router.post("/userlogin",postotp);
    router.post('/postviewcart/:id',usersession,checkBlock,postviewcart);
    router.post("/addressdetails",usersession,checkBlock,addresdetails);
    router.post("/checkout",usersession,checkBlock,payment)
    router.post("/PostEditaddress/:id",usersession,checkBlock,PostEditaddress)
    router.post("/verifycoupon",usersession,checkBlock,verifycoupon)
    router.post("/cancellorder",usersession,checkBlock,cancellorder)
    router.post("/refundorder",usersession,checkBlock,refundorder)
    router.post("/create-order",usersession,checkBlock,createorder)
    router.post("/veryfypayment",usersession,checkBlock,veryfypayment)
    router.post("/review",usersession,checkBlock,productreview)

    
    
    
    router.delete('/deleteaddress/',usersession,checkBlock,deleteaddress)

    
    
    router
        .route("/cart/")
        .patch(changequantity)
        .delete(deletecartproduct)


   




module.exports = router;