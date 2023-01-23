const UserDB = require("../models/usermodel");
const categoryDB = require("../models/categorymodel");
const productDB = require("../models/addproductmodel");
const cartDB = require("../models/cartmodel");
const AddresDB = require("../models/address");
const orderdB = require("../models/ordermodel")
const bannerDB=require("../models/bannermodel")
const coponDB=require("../models/coupon");
const reviewDB=require("../models/review")
const paypal = require("@paypal/checkout-server-sdk");
const moment = require("moment");

const envirolment =
  process.env.NODE_ENV === "production"
    ? paypal.core.LiveEnvironment
    : paypal.core.SandboxEnvironment;

const paypalCliend = new paypal.core.PayPalHttpClient(
  new envirolment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
);


const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { sendotp, verifyotp } = require("../verification/otp");
// const {
//   SecondaryAuthTokenPage,
// } = require("twilio/lib/rest/accounts/v1/secondaryAuthToken");
const { render } = require("ejs");
const { response } = require("express");

const getUserhome = async (req, res) => {
  try{
    let productlist;
    console.log(req.query);
    if(req.query.sort=="1000-3000"){
      productlist=await productDB.aggregate([{$match:{Prize:{$lt:3000,$gt:1000}}}]).sort({Prize:-1})
       }
      else if(req.query.sort=="3000-4000"){
        productlist=await productDB.aggregate([{$match:{Prize:{$lt:4000,$gt:3000}}}]).sort({Prize:-1})
       }
      else if(req.query.sort=="4000-5000"){
        productlist=await productDB.aggregate([{$match:{Prize:{$lt:5000,$gt:4000}}}]).sort({Prize:-1})
       }
      else if(req.query.sort=="5000-6000"){
        productlist=await productDB.aggregate([{$match:{Prize:{$lt:6000,$gt:5000}}}]).sort({Prize:-1})
     }
      else if(req.query.sort=="6000"){
        productlist=await productDB.aggregate([{$match:{Prize:{$gt:6000}}}]).sort({Prize:-1})
     }
      else if(req.query.sort=="acending"){
        productlist = await productDB.find().sort({Prize:1})
      }
      else if(req.query.sort=="dcending"){
        productlist = await productDB.find().sort({Prize:-1})
      }
      else{
        productlist = await productDB.find();
        console.log(productlist,"huhfweuguigfw_____________");
      }
  const categorylist = await categoryDB.find();
  // productlist = await productDB.find();
  const bannerdata = await bannerDB.find();
  res.render("user/userhome", {
    categorylist,
    productlist,
    bannerdata,
    user: req.session.user,
   });
}catch(error){res.redirect("/errorpage")
};
}


const userlogin = (req, res) => {
  res.render("user/userlogin",{usRblockERR:req.flash("usRblockERR"),
  passERR:req.flash("passERR")});
};


const userlogout=(req,res)=>{
  req.session.destroy()
  res.redirect("/userlogin")
}


const getUserSignUp = (req, res) => {
  res.render("user/usersignup",{
 PassMatchERR:req.flash("PassMatchERR")
,EmailExist:req.flash("EmailExist")});
};



const otp = (req, res) => {
  res.render("user/otpverification");
};



const getUserregister = async (req, res) => {
  console.log(req.body);
  const pass1 = req.body.password;
  const pass2 = req.body.confirm_password;
  const email = req.body.email_address;
  const Number = req.body.mobile_number;
  if (pass1 !== pass2) {
    console.log("password not match");
    req.flash("PassMatchERR","password does not match")
    res.redirect("/usersignup");
  } else {
    const hashpassword = await bcrypt.hash(pass1, 10);
    const hashpassword1 = await bcrypt.hash(pass2, 10);

    console.log(hashpassword, hashpassword1);
    await UserDB.findOne({ email_address: email }).then(async (user) => {
      console.log(user);
      if (user) {
        console.log("exist email");
        req.flash("EmailExist","Email already exist")
        res.redirect("/usersignup");
      } else {
        // user = UserDB({
        //   first_name: req.body.first_name,
        //   last_name: req.body.last_name,
        //   email_address: req.body.email_address,
        //   password: hashpassword,
        //   confirm_password: hashpassword1,
        //   mobile_number: req.body.mobile_number,
        // });

        // await user.save();
        // console.log(user);
        // console.log("sucessfully acces");
        // res.render("user/userlogin");
        sendotp(Number)
        req.session.user1=req.body
        console.log( req.session.user1);

           res.render('user/otpverification')
           console.log("redirected")
      }
    });
  }
};

const postotp = async (req, res) => {
    console.log("haiinelooo")
    console.log(req.body)

    const otp = req.body.otp;

    console.log("hellooooo233223")
    const { first_name,last_name,email_address, password,confirm_password,mobile_number} = req.session.user1;
    console.log(first_name,last_name,email_address, password,confirm_password,mobile_number);
    await verifyotp(mobile_number, otp).then(async(verification_check)=>{
        if(verification_check.status=="approved"){
            console.log(password)
            console.log("hellooooo2385296525696525665253223")
            const hashpassword=await bcrypt.hash(password,10)
            const hashpassword1=await bcrypt.hash(confirm_password,10)
            user = UserDB({
                first_name: first_name,
                last_name: last_name,
                mobile_number: mobile_number,
                email_address: email_address,
                password:hashpassword,
                confirm_password:hashpassword1
                    });
                user.save();

                console.log(user)
                res.render('user/userlogin',{usRblockERR:req.flash("usRblockERR"),passERR:req.flash("passERR")})

        }
        else{
            req.send("otp error")
        }
     })

}



const postUserhome = async (req, res) => {
  try {
    console.log("started login");
    console.log(req.body);

    const { email, password } = req.body;
    console.log(email);
    const userdetails = await UserDB.findOne({ email_address: email });
    if (userdetails) {
      console.log("successfull user");
      console.log(userdetails.password);
      await bcrypt.compare(password, userdetails.password, (err, data) => {
        console.log("data" + data);

        if (err) throw err;
        else if (data == true) {
          if (userdetails.block == true) {
            console.log("console success");
            req.session.LoggedIn = true;
            req.session.user = userdetails;
            res.redirect("/");
          } else {
            console.log("User blocked");
            req.flash("usRblockERR","YoU are blocked")
            res.redirect("/userlogin");
          }
        } else {
          console.log("wrong password");
          req.flash("passERR","Wrong passwor or email")
          res.redirect("/userlogin");
        }
      });
    }
  } catch(error){
res.redirect("/errorpage")
  }
};


const getproductdetails = async (req, res) => {
  try{
  console.log(req.params.id);
  const product_dtails = req.params.id;
  const productsdatails = await productDB.findById({ _id: product_dtails });
  const reviewdata=await reviewDB.find({product:req.params.id})
  console.log(productsdatails);
  console.log(reviewdata);
  res.render("user/productdetails", {
    productsdatails,
    user:req.session.user,
    reviewdata
  });
}catch(error){
console.log(error);
res.redirect("/errorpage");
};
}


const getproducts = async (req, res) => {
  try{
    let pagenation=res.pagenation;
    let allproduct=res.pagenation.results
    console.log(pagenation);
  const categorylist = await categoryDB.find();
  //  const productlist = await productDB.find();

  let productlist ;
  console.log(req.query)
  if(req.query.sort == "women" ){
    productlist = await productDB.find({Category:{$eq:"women"}})
  }
  else if
  (req.query.sort == "man" ){
    productlist = await productDB.find({Category:{$eq:"man"}})
  }
  else{
    productlist = await productDB.find()
  }

  res.render("user/products", {
    categorylist,
    productlist,
    user: req.session.user,
    allproduct,
    pagenation
  });
}catch(error){
  res.redirect("/errorpage")
};
}


const getviewcart = async (req, res) => {
  try {
    const userId = req.session.user._id;
    console.log(userId);
    const cartitems = await cartDB
      .findOne({ owner: mongoose.Types.ObjectId(userId) })
      .populate("items.productDedtails");
    if(cartitems.items.length!=0){
    res.render("user/viewcart", { cartitems, user: req.session.user,prolimit:req.flash("prolimit")});
    }else{
      res.render("user/emptycart", {user: req.session.user });
    }
  } catch (error) {
    console.log(error);
res.redirect("/errorpage")
  }
};


const postviewcart = async (req, res) => {
  try {
    const productId = req.params.id;
    const User = req.session.user._id;
    console.log(productId, User);
    const user = await cartDB.findOne({ owner: User });
    const product = await productDB.find({ _id: productId });
    console.log(product, user);
    let price;
    if(product.discountPrice<product.Prize&&product.discountPrice!=0){
     price=product[0].discountPrice;
    }else{
      price=product[0].Prize;
    }

    if(product[0].quantity < 1) {
      console.log("noo adition");
      res.json({noAvailability:true})
    } else {
      const productprize = product[0].Prize;
      if (!user) {
        const Addtocart = await cartDB({
          owner: User,
          items: [{ productDedtails: productId, total: productprize }],
          totalCart: productprize,
        });
        Addtocart.save().then((response) => {
          res.json({status:true});
        });
      } else {
      const existProduct = await cartDB.findOne({
          owner: User,
          "items.productDedtails": productId,
        });
        if (existProduct !=null) {
          
         const  proQuantity=await cartDB.aggregate([
          {
            $match:{owner:mongoose.Types.ObjectId(User)}},
            {
              $project:{
                items:{
                  $filter:{
                    input:"$items",
                    cond:{
                      $eq:[
                        "$$this.productDedtails",
                        mongoose.Types.ObjectId(productId)
                      ],
                    },
                  },
                },
              },
            },
         ]);
    console.log(proQuantity,"000000");
    const quantity=  proQuantity[0].items[0].quantity;
    console.log(quantity,"-------------------------");
    if(product[0].quantity<=quantity){
      res.json({ stockReached: true });
    }else{ console.log(existProduct + "+++++");
          await cartDB
            .updateOne(
              { owner: User, "items.productDedtails": productId },
              {
                $inc: {
                  "items.$.quantity": 1,
                  "items.$.total": productprize,
                  totalCart: productprize,
                },
              }
            )
            .then((response) => {
              res.json({status:true});
            })
            .catch((err) => {
              console.log(err);
            });
        }}
        else {
          await cartDB.updateOne(
            { owner: User },
            {
              $push: {
                items: { productDedtails: productId, total: productprize },
              },
              $inc: { totalCart: productprize },
            }
          )
          .then((response) => {
            res.json({status:true});
          })
        }
      }
    }
  } catch(error){
res.redirect("/errorpage")
  }
};


const changequantity = async (req, res) => {
  try {
    console.log(req.body);
    const { cartId, productId, count } = req.query;
    console.log(cartId, productId, count, "ugdshfghdsVHgHVDA");
    const product = await productDB.findOne({ _id: productId });
  let price;
    if(product.discountPrice<product.Prize&&product.discountPrice!=0)
    {
      price=product.discountPrice;
    }else{
      price=product.Prize;
    }
    if (count == 1) {
      console.log("ttttt");
      var productprice = price;
    console.log(productprice);
    } else {
      var productprice = -price;
    }
    const  proQuantity=await cartDB.aggregate([
      {
        $match:{owner:mongoose.Types.ObjectId(req.session.user._id)}},
        {
          $project:{
            items:{
              $filter:{
                input:"$items",
                cond:{
                  $eq:[
                    "$$this.productDedtails",
                    mongoose.Types.ObjectId(productId)
                  ],
                },
              },
            },
          },
        },
     ]);
     console.log(proQuantity,"000000");
     const quantity=  proQuantity[0].items[0].quantity;
     console.log(quantity,"-------------------------");
     console.log(product.quantity,"theyyyyyyyyyyyyyyyyyyy");
     if(product.quantity<=quantity&&count==1){
       res.json({stockReached: true });
     }else{
      const cart = await cartDB
      .findOneAndUpdate(
        { _id: cartId, "items.productDedtails": productId },
        {
          $inc: {
            "items.$.quantity": count,
            "items.$.total": productprice,
            totalCart: productprice,
          },
        }
      )
      .then(() => {
        res.json();
      });
     }
    } catch (error) {
res.redirect("/errorpage");
  }
};





const deletecartproduct = async (req, res) => {
  try {
    console.log("cart delete");
    const productId = req.query.productId;
    // console.log(productId,productId,"theeeeeeeeeeeeeeeeeee");
    const userId = req.session.user;
    console.log(productId, userId, "theeeeeeeeeeeeeeeeeee");
    const product = await productDB.findOne({ _id: productId });
    console.log(product);
    const cart= await cartDB.findOne({owner:userId})
  
    const index= await cart.items.findIndex((el)=>{
      return el.productDedtails==productId;
    })
    const productprize = cart.items[index].total;
    const deleteproduct = await cartDB.findOneAndUpdate(
      { owner: userId },
      {
        $pull: {
          items: { productDedtails: productId },
        },
        $inc: { totalCart: -productprize },
      }
    );
    deleteproduct.save().then(() => {
      res.json("success");
    });
  } catch (error) {
res.redirect("/errorpage");
  }
};


const getprofile = async (req, res) => {
  try{
  const User = req.session.user._id;
  const addressdetails = await AddresDB.findOne({ User: User });
  let address;
  if (addressdetails) {
    address = addressdetails.Address;
  } else {
    address = [];
  }
  res.render("user/profile", { address, user: req.session.user });
}catch(error){
  res.redirect("/errorpage")
};
}


const getaddress = (req, res) => {
  try{
  res.render("user/address", { user: req.session.user });
}catch(erro){res.redirect("/errorpage");
}
};



const addresdetails = async (req, res) => {
  try {
    console.log(req.body);
    const { Fname, Pincode, Addressline, city, State, Country } = req.body;
    if (Fname && Pincode && Addressline && city && State && Country) {
      const userId = req.session.user._id;
      console.log(userId);
      const Existuser = await AddresDB.findOne({ User: userId });
      console.log(Existuser);
      if (Existuser) {
        await AddresDB.findOneAndUpdate(
          { User: userId },
          { $push: { Address: [req.body] } }
        ).then(() => {
          res.redirect("/profile");
        });
      } else {
        const addaddress = await AddresDB({
          User: userId,
          Address: [req.body],
        });
        await addaddress.save().then(() => {
          res.redirect("/profile");
        });
      }
    } else {
      console.log("DSFHGFHJFi");
      res.redirect("/address");
    }
  }catch(errer) {
    
  res.redirect("/errorpage");
    };
  }



const deleteaddress= async (req,res)=>{
  try{
  const userId=req.session.user._id;
  const addressId=req.query.addressId;
  console.log(addressId);
  await AddresDB.updateOne({User:userId},{$pull:{Address:{_id:addressId}}})
  res.json("success")
  }catch(error){
res.redirect("/errorpage");
  }
}


const geteditaddress=async(req,res)=>{
  try{
console.log(req.params.id);
const user=req.session.user._id
const addressdetails= await AddresDB.findOne({User:user})
console.log(addressdetails);
const address= addressdetails.Address.find((el)=>
  el._id.toString()===req.params.id
);
console.log(address);
  res.render("user/editaddress",{address,user: req.session.user,EdiaddressERR:req.flash("EdiaddressERR") })
}catch(error){
  res.redirect("/errorpage")
}
}



const PostEditaddress=async(req,res)=>{
  try{
  console.log(req.params.id);
  const addressId=req.params.id;
  const { Fname, Pincode, Addressline, city, State, Country } = req.body;
  console.log(Fname, Pincode, Addressline, city, State, Country,"ihiufqgi");
  if(Fname&&Pincode&&Addressline&&city&&State&&Country )
  {
    
  const chngaddrss=await AddresDB.findByIdAndUpdate(
             addressId  
    ,
    {
      $set:{
        "address.$.Fname":Fname,
        "address.$.Pincode":Pincode,
        "address.$.Addressline":Addressline,
        "address.$.city":city,
        "address.$.State":State,
        "address.$.Country":Country,
      },
      new:true
    },
    {upsert:true})
    console.log(chngaddrss);
    res.redirect("/profile")
  }else{
    req.flash("EdiaddressERR","Full fill the coloms")
    res.redirect("/editaddress/"+req.params.id)
  }
  console.log(chngaddrss);
}catch(error){
  res.redirect("/errorpage")
}
}





const  getcheckout=async(req,res)=>{
  try{
  const User = req.session.user._id;
  const addressdetails = await AddresDB.findOne({ User: User });
  const cartitems = await cartDB
  .findOne({ owner: mongoose.Types.ObjectId(User) })
  .populate("items.productDedtails");
   let address;
   console.log(cartitems.items,"hyhyhyyyyyyyyyyyyyyyyyyhuj");
  if (addressdetails) {
    address = addressdetails.Address;
  } else {
    address = [];
  }
  let check=true;
  let products=[];
  for(i=0;i<cartitems.items.length;i++)
  {
    if(cartitems.items[i].quantity>cartitems.items[i].productDedtails.quantity)
    {
      check=false;
      products.push(cartitems.items[i].productDedtails.ProductName);
    }
  }
  console.log(check);


  
  if(check==false)
  {
    req.flash("prolimit",products+" out of stock")
    res.redirect("/getviewcart")
  }else{if(cartitems){
    res.render("user/checkout", {cartitems, 
      address,
       user: req.session.user,
       purchasErr:req.flash("purchasErr"), 
      paypalclientid:process.env.PAYPAL_CLIENT_ID});}
  else{
    res.redirect("/getviewcart")
  }
  }}catch(error){
    res.redirect("/errorpage")
}
}


const payment =async(req,res)=>{
  try{
  const addressindex=req.body.index;
  const paymethod=req.body.paymode;
  const couponamount=req.body.coupon;
  const totalamount=req.body.total;
  console.log(addressindex,paymethod,couponamount,totalamount);
  const userid=req.session.user._id;
  const selectedaddress= await AddresDB.findOne({User:userid})
  const address=selectedaddress.Address[parseInt(addressindex)];
  const cartdetails=await cartDB.findOne({owner:userid}).populate("items.productDedtails")
  const cartitem=cartdetails.items;
  console.log(cartitem,address,selectedaddress);
  // const carttotal=cartdetails.totalCart;
  // const coupon=await coponDB.find({code:couponamount})
   if(addressindex&&paymethod)
 {
   if(paymethod==='cash on delivery')
   {
    console.log("the ehbvdiubvskall hoiiii");
     const order= await orderdB({
      date: moment().format("DD/MM/YYYY"),
      time: moment().toDate().getTime(),
      UserId:userid,
      Products:cartitem,
      address:address,
      couponDiscount:couponamount,
      paymentMethod:paymethod,
      total:totalamount,
      orderStatus:'confirm',
      paymentStatus:'peyment pending'
     })
     order.save().then(async(result)=>{
      console.log(result);
      req.session.cartid=result._id; 
      const usercart=await cartDB.findOneAndRemove({owner:userid})
      const product=usercart.items;
      product.forEach(async(e) => {
        await productDB.findByIdAndUpdate(
          {_id:e.productDedtails},{$inc:{quantity:-e.quantity}}
        )
      });

      if(couponamount){
        await coponDB.findOneAndUpdate({maxRedeemAmount:couponamount},{$inc:{generateCount:-1}})     
      }
       res.json({cashONdelivery:true})
     })
    
   }else if(paymethod==="paypal")
   {
    const order= await orderdB({
      date: moment().format("DD/MM/YYYY"),
      time: moment().toDate().getTime(),
      UserId:userid,
      Products:cartitem,
      address:address,
      couponDiscount:couponamount,
      paymentMethod:paymethod,
      total:totalamount,
      orderStatus:'confirm',
      paymentStatus:'peyment pending'
     })
     order.save().then(async(result)=>{
      let userOrderData = result;
      console.log(userOrderData);
            console.log(userOrderData);
            req.session.orderId = result._id;
            id = result._id.toString();
            console.log(id);

          
            let response = {
              paypal: true,
              balancepayment:totalamount,
              
              // razorpayOrderData: order,
              userOrderData: userOrderData,
            };
            res.json(response);
     })
   }else if(paymethod==="Wallet"){
    const user=await UserDB.findById(userid)
    const walltbalance=user.useWallet;
    console.log(walltbalance);
    if(walltbalance<=0){
      res.json({noBalance:true})
    }
    else if(walltbalance<totalamount){
      const balancepayment=totalamount-walltbalance
      console.log(balancepayment,totalamount,"ththhiuhnfsjlkdcnljksyyyyyyyyyyyyyy");
      const order= await orderdB({
        date: moment().format("DD/MM/YYYY"),
        time: moment().toDate().getTime(),
        UserId:userid,
        Products:cartitem,
        address:address,
        couponDiscount:couponamount,
        paymentMethod:paymethod,
        total:totalamount,
        orderStatus:'confirm',
        paymentStatus:'peyment pending'
       })
       order.save().then(async(result)=>{
        let userorederdata=result;
      await UserDB.findByIdAndUpdate(req.session.user,{$set:{useWallet:0}})
      let response={
          paypal:true,
          balancepayment:balancepayment,
          walletamonunt:walltbalance,
          userOrderData:userorederdata,
        };
        res.json(response)
      })
    }else{
      const order= await orderdB({
        date: moment().format("DD/MM/YYYY"),
        time: moment().toDate().getTime(),
        UserId:userid,
        Products:cartitem,
        address:address,
        couponDiscount:couponamount,
        paymentMethod:paymethod,
        total:totalamount,
        orderStatus:'confirm',
        paymentStatus:'peyment pending'
       })
       console.log(totalamount,userid,"ihuohudqfhOEGF");
       order.save().then(async(result)=>{
        const usercart=await cartDB.findOneAndRemove({owner:userid})
        const product=usercart.items;
        product.forEach(async(e) => {
          await productDB.findByIdAndUpdate(
            {_id:e.productDedtails},{$inc:{quantity:-e.quantity}}
          )
        })
        await UserDB.findOneAndUpdate(
                  { _id: userid },
                  { $inc: { useWallet: -totalamount } }
                );
    if(couponamount){
          await coponDB.findOneAndUpdate({maxRedeemAmount:couponamount},{$inc:{generateCount:-1}})     
        }
         res.json({Wallet:true})})
    }
   }else{
    res.json({choosepay:true})
   }
}
else
{
  res.json({chooseaddress:true})
}
}catch(error){
  res.redirect("/errorpage")
}
}




const  ordersucecss=(req,res)=>{
  try{
  res.render("user/ordersuccess",{user: req.session.user })
  }catch(error){
res.redirect("/errorpage")
  }
}



const  getorderlist=async(req,res)=>{
  try{
  const orderdetials = await orderdB.find({UserId:req.session.user}).populate("UserId").sort({'createdAt':-1});
  console.log(orderdetials,"checkk order listt");
  res.render("user/orderlist",{orderdetials,user: req.session.user })
  }catch(error){
res.redirect("/errorpage")
  }
}


const orderdetials=async(req,res)=>{
  try{
    const odrdtls=await orderdB.findOne({_id:req.params.id}).populate("Products.productDedtails")
   res.render("user/ordersuccess",{odrdtls,user: req.session.user})
}catch(error){
  res.redirect("/errorpage")
}
}


const verifycoupon= async(req,res)=>{
  try{
  const codename=req.body.couponcode;
  const total=req.body.total;
 
  let grandtotal;
  let coupnMsg;
  let nowDate=moment().toDate();
  
    
  console.log(nowDate);
  const coupon= await coponDB.find({code:codename,status:"ACTIVE"})
  console.log(coupon);
  if(coupon.length<1)
  {
    coupnMsg = "Coupon Invalid";
    res.json({ status: false,coupnMsg});
  }else{
    let expireDate= coupon[0].expireDate
    let couponType = coupon[0].couponType;
    let cutOff = coupon[0].cutOff;
    let maxRedeemAmount = coupon[0].maxRedeemAmount;
    let minCartAmount = coupon[0].minCartAmount;
    let generateCount = coupon[0].generateCount;
    console.log(expireDate,couponType,cutOff,maxRedeemAmount);
   
    // let expiredate=moment().toDate();  
    // let expiredate=moment().toDate(); 
  if(generateCount>=1){
    if(expireDate.getTime()>nowDate.getTime()){
      
      console.log("workig");
      console.log(expireDate);
      console.log(nowDate);
      console.log(expireDate-nowDate);
    if(couponType=="Amount"){
    if(total<minCartAmount)
       {
        console.log("...........>>>>>>>>>>>>>..");
        coupnMsg="Minimum Rs."+minCartAmount+"need to Apply this Coupon";
        res.json(coupnMsg);
       }else{
        grandtotal=Math.round(total-cutOff)
        console.log(grandtotal,"&&&&&&&&&&&&&&&&&&&&777");
        let response={
          status:true,
          grandtotal:grandtotal,
          cutOff:cutOff,
          }
          res.json(response)
       }
      }else if(couponType=="Percentage"){
        if(total<minCartAmount)
        {
         coupnMsg="Minimum Rs."+minCartAmount+"need to Apply this Coupon";
         res.json({ status: false,coupnMsg });
        }else{
        const reduceamount=((total*cutOff)/100);
        if(reduceamount>maxRedeemAmount)
        {
          grandtotal=Math.round(total-maxRedeemAmount)
          let response={
            status:true,
            grandtotal:grandtotal,
            cutOff:maxRedeemAmount,
            }
            res.json(response)
        }else{
          grandtotal=Math.round(total-reduceamount)
          let response={
            status:true,
            grandtotal:grandtotal,
            cutOff:reduceamount,
            }
            res.json(response)
          }
      }
    }
    }else{
      console.log("+++++++++++++++++++++++++++");
      coupnMsg="coupon date expired";
      console.log(expireDate);
      console.log(nowDate);
      console.log(expireDate-nowDate);
     res.json({status:false,coupnMsg});
    }
  }else{
    coupnMsg="coupon limit exceeded";
    res.json({ status: false,coupnMsg });
  }
}

  console.log(codename,total);
}catch(error){
  console.log(error);
  res.redirect("/errorpage")
}
}



const cancellorder=async(req,res)=>{
  try{
    const order= await orderdB.findById(req.body.orderid)
    const ordersattus=order.orderStatus;
    if(ordersattus=="Delivered"){
      console.log(req.body.orderid);
      const orderdata= await orderdB.findByIdAndUpdate(
        req.body.orderid,
        {orderStatus:"Returned"})
        const product=orderdata.Products;
        product.forEach(async(el)=>{
          await productDB.findOneAndUpdate({_id:el.productDedtails},
            {$inc:{quantity:el.quantity}})
          })
    }else{
      console.log(req.body.orderid);
      const orderdata= await orderdB.findByIdAndUpdate(
        req.body.orderid,
        {orderStatus:"Cancelled"})
        const product=orderdata.Products;
        product.forEach(async(el)=>{
          await productDB.findOneAndUpdate({_id:el.productDedtails},
            {$inc:{quantity:el.quantity}})
        })
    }
    
  }catch(error){
res.redirect("/errorpage")
}}

const refundorder=async(req,res)=>{
  try{
const orederdetais= await orderdB.findById(req.body.orderId).populate("UserId")
  console.log(orederdetais.UserId.useWallet);
if(orederdetais.UserId.useWallet===0)
{
 console.log("}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}");
  await UserDB.updateOne({_id:orederdetais.UserId},
    {$set:{useWallet:orederdetais.total},new:true},{upsert:true})
}else{
  console.log("threeee+++++++++");
  await UserDB.findByIdAndUpdate(orederdetais.UserId,
    {$inc:{useWallet:orederdetais.total}})
}
const orderdata= await orderdB.findByIdAndUpdate(
  req.body.orderId,{orderStatus:"Refunded"})
  .then((response)=>
  {res.json({response:true})})
}catch(error){
  res.redirect("/errorpage")
}
}



const createorder=async(req,res)=>{
  const request = new paypal.orders.OrdersCreateRequest();

  console.log("////////");
  console.log(req.body.items[0].amount);
  const balance = req.body.items[0].amount;

  console.log(balance,"jj");
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: balance,

          breakdown: {
            item_total: {
              currency_code: "USD",
              value: balance,
            },
          },
        },
      },
    ],
  });
  try {
    console.log(",,,,,,,");
    const order = await paypalCliend.execute(request);
    console.log(".........");
    console.log(order);
    console.log(order.result.id);
    res.json({ id: order.result.id });
  } catch (error) {
    res.redirect("/errorpage")
  }
};


const veryfypayment=async(req,res)=>{
  try{
  console.log(req.body);
  const userOrderDataid=req.body.userOrderData._id;
  console.log(userOrderDataid);
  await orderdB.findByIdAndUpdate(userOrderDataid,{
    orderStatus:"confirm",
    paymentStatus:"payment completed"
  }).then(async(result)=>{
    console.log(("rertertutf"));
    if(result.orderconfirmed=="Wallet")
    {
      await orderdB.findByIdAndUpdate(userOrderDataid,
        {$set:{useWallet:req.body.walletBalance}})

      await  UserDB.findByIdAndUpdate(req.session.user._id,
        {$set:{useWallet:-req.body.walletBalance}})
    }
    const usercart=await cartDB.findOneAndRemove({owner:req.session.user._id})
    const product=usercart.items;
    product.forEach(async(e) => {
      await productDB.findByIdAndUpdate(
        {_id:e.productDedtails},{$inc:{quantity:-e.quantity}}
      )
    });
    
    const coupon=await coponDB.find({code:req.body.couponcode})
    if(coupon)
    {
      console.log(coupon,"twehgfyivshlyyyy");
      await coponDB.findOneAndUpdate({code:req.body.couponcode},
        {$inc:{generateCount:-1}}).then((response)=>{
           res.json({status:true})
        })
    }}
   )

}catch(error){
  res.redirect("/errorpage")
}
}


const productreview=async(req,res)=>{
  try{
  console.log(req.body);
  const productname=req.body.formProps.time;
  console.log(productname);
  const prodata=await productDB.find({ProductName:productname})
  const proid=prodata[0]._id;
  console.log(prodata,proid,"oihiuofgoeygfti");
  let{rating,review,name}=req.body.formProps;
  console.log(rating,review,name);
  rating=rating*20;
  Object.assign(req.body.formProps,{user:req.session.user._id,rating:rating,product:proid})
  console.log(req.body.formProps);
  if(rating&&review&&name){
  await reviewDB.findOneAndReplace({product:proid,user:req.session.user._id},req.body.formProps).then(async(result)=>{
      if(result){
        let rat = {} = await productDB.findById(proid, { _id: 0, rating: 1 ,review :1});
        rating=(rat.rating+rating - result.rating)/rat.review
          await productDB.findByIdAndUpdate(proid,{$set:{rating:rating}}).then((response)=>{
            res.json({status:true}); 
          })
          
      }else{
        const newReview = await new reviewDB(req.body.formProps);
        await newReview.save().then(async () => {
          await Product.findByIdAndUpdate(proid, {
            $inc: { review: 1 },
            $set: { rating: rating },
          }).then((response)=>{
            res.json({status:true}); 
          })
        });
      }
  })
}else{
  res.json({response:false})
}
}catch(error){
  res.redirect("/errorpage")
  }
}


const geterrorpage=(req,res)=>{
  res.render("user/errorpage")
} 






module.exports = {
  getUserhome,
  getUserSignUp,
  getUserregister,
  postUserhome,
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
  geterrorpage
};
