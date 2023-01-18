const express=require('express')
const upload=require("../middleware/muter")
const bannermulter=require("../middleware/bannermulter")
const session=require("../middleware/adminsession")
const router=express.Router();
const {getAdmin,
    AdminLogin,
    getusers,
    blockuser,
    unblockuser,
    getcategorylist,
    getaddcategory,
    postaddcategory,
    categoryDelete,
    categoryEdit,
    posteditcategory,
    getproductlist,
    getaddproduct,
    postproductdata,
    productDelete,
    getproductedit,
    posteditproduct,
    getorderlist,
    orderdetails,
    add_banner,
    bannerlist,
    changestatus,
    postbannerdetails,
    deletebanner,
    getcoupon,
    add_coupon,
    postcoupondetials,
    CoponActive,
    CoponBlock,
    deletecoupon,
    salesreport,
    monthreport,
    yearReport,
    dashboard,
    geterrorpage
} = require("../controllers/admincontroler");


    
    //get methods
    
    router.get("/",getAdmin);
    
    router.get("/userdetails",session,getusers);
    router.get("/block/:id",session,blockuser);
    router.get("/unblock/:id",session,unblockuser);
    router.get("/categorylist",session,getcategorylist);
    router.get("/getaddcategory",session,getaddcategory);
    router.get("/categoryDelete/:id",session,categoryDelete);
    router.get("/categoryEdit/:id",session,categoryEdit);
    router.get("/getproductlist",session,getproductlist);
    router.get("/getaddproduct",session,getaddproduct);
    router.get("/productDelete/:id",session,productDelete);
    router.get("/getproductedit/:id",session,getproductedit);
    router.get("/getorderlist",session,getorderlist);
    router.get("/orderdetails/:id",session,orderdetails);
    router.get("/addbanner",add_banner);
    router.get("/bannerlist",session,bannerlist);
    router.get("/addcoupen",session,add_coupon);
    router.get("/CoponActive",session,CoponActive);
    router.get("/CoponBlock",session,CoponBlock);
    router.get("/salesreport",session,salesreport);
    router.get("/monthreport",session,monthreport);
    router.get("/yearReport",session,yearReport);
    router.get("/dashboard",session,dashboard);
    router.get("/errorpage",session,geterrorpage);
    

    //post methods

    router.post("/Adminlogin",AdminLogin);
    router.post("/postaddcategory",session,upload.array("ImageURL",3),postaddcategory);
    router.post("/posteditcategory/:id",session,upload.array("ImageURL",3),posteditcategory);
    router.post("/postproductdata",session,upload.array("ImageURL",4),postproductdata);
    router.post("/posteditproduct/:id",session,upload.array("ImageURL",4),posteditproduct);
    router.post("/bannerdetails",session,bannermulter.array("ImageURL",2),postbannerdetails);
    router.post("/orderstatus",session,changestatus)
    // router.post("/coupondetails",session,postcoupondetials)

   

    //delete methods
   
    router.delete("/deletebanner",session,deletebanner)


    //chain router


    router.
    route('/coupon')
    .get(session,getcoupon)
    .post(session,postcoupondetials)
    .delete(session,deletecoupon)





module.exports = router;