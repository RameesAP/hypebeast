const express = require('express');
const { response } = require('../app');
const router = express.Router();
const userHelper = require('../helpers/user-helpers')

const twillioHelper = require('../helpers/twillio-helpers')
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
/* GET home page. */

//middlewware

const verifyLogin=(req,res,next)=>{
  if(req.session.user){
    next()
  }else{
    res.redirect('/login')
  }
};

// productHelpers.getAllProduct().then((products)=>{
//   console.log(products);
//   res.render('user/view-products' ,{ user: true,userfot: true,products})
// })


router.get('/', async(req, res, next) =>{
 
  let User = req.session.user

  if (req.session.user) {
    let cartCount=await userHelper.getCartCount(req.session.user._id)
    let wishlistCount=await userHelper.getWishlistCount(req.session.user._id)
    console.log(cartCount);
    productHelpers.getAllProduct().then((products)=>{
      console.log(products);
      productHelpers.getAllBanners().then((banner)=>{
        console.log(banner,"banner is here");
      res.render('user/index', { user: true,userfot: true,User ,products,banner,cartCount,wishlistCount});

      })
    })
    // res.render('user/index', { user: true,userfot: true,User });
  }
  else {
    productHelpers.getAllProduct().then((products)=>{
    res.render("user/index",{products})
    })
  }
});

router.get('/login', (req, res, next) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {

    res.render('user/login', { user: false, "loginErr": req.session.loginErr });
    req.session.loginErr = false
  }

});

router.get('/signin', (req, res) => {
  res.render('user/signin', { user: false })
});

// router.get('/otp', (req, res) => {
//   res.render('user/otp')
// });

router.get('/otp', (req, res) => {
  res.render('user/otp')
})


router.post('/signin',(req, res) => {
//  console.log(req.body);
    userHelper.verifyUser(req.body).then((response) => {
      console.log(response);
      if (response.status) {
        req.session.body = req.body
        console.log(req.session.body);

        twillioHelper.doSms(req.body).then((data) => {
          req.session.body = req.body

          // console.log(req.session.body);

          if (data) {

            res.redirect('/otp')
          } else {
            res.redirect('/signin')
          }
        })
      } else {
        req.session.signUpErr = "Email already exists"
        res.redirect('/signin')
      }

    })



}),


//otp


router.post('/otp',(req, res) =>{
  
  twillioHelper.otpVerify(req.body, req.session.body).then((response) => {

      if (response) {

        userHelper.doSignin(req.session.body).then((response) => {

          res.redirect('/login')
        })

      } else {
        req.session.message = "Invalid  OTP"
        res.redirect('/otp')


      }


    })

  


}),


// router.post('/signin', (req, res) => {
//   userHelper.doSignin(req.body).then((state) => {
//     if(state.userexist){
//       req.session.userAlreadyExist=true;
//       res.redirect('/login')
//     }else{
//       req.session.user=state.user;
//       console.log(state.user);
//       res.redirect('/')
//     }
    

//   })
// });
router.post('/login', (req, res) => {
  // console.log(req.body);
  userHelper.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr = true
      res.redirect('/login')
    }
  })
});

//navebar control

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
});



router.get('/contact',(req,res)=>{
  let User = req.session.user
  res.render('user/contact',{user: true,userfot: true,User})
})


router.get('/about',(req,res)=>{
  let User = req.session.user
  res.render('user/about',{user: true,userfot: true,User})
})

router.get('/product',verifyLogin,async(req,res)=>{
  let User = req.session.user
  cartCount = await userHelpers.getCartCount(req.session.user._id);
  productHelpers.getAllProduct().then((products)=>{
    // console.log(products);
  res.render('user/product',{user: true,userfot: true,User,products,cartCount})
  })
})

router.get('/product-page',(req,res)=>{
  let User = req.session.user
  res.render('user/product-detail',{user: true,userfot: true,User})
})

// router.get('/modal/:id',(req,res)=>{
//   let id = req.params.id
// productHelpers.getModal(id).then((response)=>{
//   console.log(response,"ttttttttttttttttttttttttttt")
// })
// })




/////////////my account





router.get('/address',(req,res)=>{
  let User = req.session.user
  console.log('pettttttttt');
  res.render('user/add-address',{user: true,userfot: true,User})
})



router.get('/editprofile/:id',async(req,res)=>{
  console.log('edit profileeeeeeeeeeeeeeeeeee');
  let userId=req.params.id
  console.log(userId);
  let User = req.session.user
  let UserEdit= await userHelpers.editUser(userId)
  res.render('user/edit-profile',{user: true,userfot: true,User,UserEdit})
})



router.get('/editpassword',(req,res)=>{
  let User = req.session.user
  res.render('user/edit-password',{user: true,userfot: true,User})
})


router.post('/add-address',(req,res)=>{
  console.log('Addressssssssssssssss');
  console.log(req.body,'req.body');
  userHelpers.insertAddress(req.body,req.session.user._id).then((response)=>{
    
    res.redirect('/myaccount')
  })
})

router.get('/myaccount',(req,res)=>{
  let User = req.session.user
  let userId= req.session.user._id
  userHelper.viewAddress(userId).then((address)=>{
    res.render('user/myaccount',{user: true,userfot: true,address,User})
    // res.render('user/myaccount',{user: true,userfot: true,User})
  })
  // res.render('user/myaccount',{user: true,userfot: true,User})
})




//modal

router.get('/singleProduct/:id',(req,res)=>{
  let id = req.params.id
  productHelpers.getSingleProduct(id).then((product)=>{
    console.log(product)
    res.json(product)
  })
})

// router.get('/productSingle/:id',(req,res)=>{
// console.log("aaaaaa")
// })
//cart


// router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
//   userHelper.addToCart(req.params.id,req.session.user._id).then(()=>{
//     res.redirect('/product-page')
//   })
// })



////////////////////////////////////////////////////////cart///////////////////////////////////////////////////


router.get("/cart",async (req, res,next) => {
  try {
    let products = await userHelpers.getCartProducts(req.session.user._id);
    let total =await userHelpers.getTotalAmount(req.session.user._id);
    console.log(total);
    let cartCount = null;
    if (req.session.user) {
      cartCount = await userHelpers.getCartCount(req.session.user._id);
    }

    userDetails = req.session.user;
    let User = req.session.user
    res.render("user/cart", {user: true,total,products,userDetails,cartCount,User});
  } catch (error) {
    next();
  }
});

router.post("/add-to-cart", (req, res, next) => {
  try {
    userHelpers.addToCart(req.body, req.session.user._id).then(() => {
      // res.redirect("/");
      
      res.json({ status: true });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/delete-cartProduct/:id',(req,res)=>{
  let prodId=req.params.id
  console.log(prodId,"llllllllllllllllllllllllllllllllll");
  const userId = req.session.user._id
  userHelpers.deleteCart(userId, prodId).then((response)=>{
    res.redirect('/cart')
  })
})

///////////////////cart qty innc dic////////////// 

router.post('/incQty/:id',(req,res)=>{
  let incId=req.params.id
  console.log(incId,"asasasasasasas")
  userHelpers.incrementQty(incId,req.session.user._id).then((response)=>{
  
    res.json({response})
  })
})

router.post('/decQty/:id',(req,res)=>{
  let decId=req.params.id
  console.log(decId,"asassdfffffff")
  userHelpers.decrimentQty(decId,req.session.user._id).then((response)=>{
  
    res.json({response})
  })
})



////////////////////////////wishlist///////////////////////////////////


router.get('/wishlist',async(req,res)=>{
  let User = req.session.user
  let wishlistitems = await userHelpers.getWishlistProducts(req.session.user._id);
  let wishlistCount=await userHelper.getWishlistCount(req.session.user._id)
  cartCount = await userHelpers.getCartCount(req.session.user._id);
  res.render('user/wishlist',{user: true,userfot: true,User,wishlistCount,cartCount,wishlistitems})
  
})



router.post("/add-to-wishlist", (req, res, next) => {
  try {
    userHelpers.addToWishlist(req.body, req.session.user._id).then(() => {
      // res.redirect("/");
      
      res.json({ status: true });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/delete-wishlistProduct/:id',(req,res)=>{
  let prodId=req.params.id
  console.log(prodId,'ooooooooooooooooooooo');
  const userId =req.session.user._id
  userHelpers.deleteWishlist(userId,prodId).then((response)=>{
    res.redirect('/wishlist')
  })
})




////////////////////////////Checkout form//////////////////////////////////////////



router.get('/checkout',async(req,res)=>{
  let User = req.session.user
  let userId= req.session.user._id
  let products = await userHelpers.getCartProducts(req.session.user._id);
  let cartCount=await userHelper.getCartCount(req.session.user._id)
  console.log(products,"hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
  let total =await userHelpers.getTotalAmount(req.session.user._id);
    console.log(total);
  userHelper.viewAddress(userId).then((address)=>{
    res.render('user/checkout2',{user: true,userfot: true,address,User,total,userId,cartCount,products})
    // res.render('user/myaccount',{user: true,userfot: true,User})
  })
  // res.render('user/myaccount',{user: true,userfot: true,User})
})

router.post('/payment',async(req,res)=>{
  
})


////////////////////////////////////codDelivery//////////////////

router.get('/coddelivery',(req,res)=>{
  
  res.render('user/codDelivery',{user: true,userfot: true})
})



module.exports = router;
