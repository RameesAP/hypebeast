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


router.get('/', function (req, res, next) {
 
  let User = req.session.user
  if (req.session.user) {
    productHelpers.getAllProduct().then((products)=>{
      console.log(products);
      res.render('user/index', { user: true,userfot: true,User ,products});


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
 console.log(req.body);
    userHelper.verifyUser(req.body).then((response) => {
      console.log(response);
      if (response.status) {
        req.session.body = req.body
        console.log(req.session.body);

        twillioHelper.doSms(req.body).then((data) => {
          req.session.body = req.body

          console.log(req.session.body);

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
  console.log(req.body);
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
router.get('/myaccount',(req,res)=>{
  let User = req.session.user
  res.render('user/myaccount',{user: true,userfot: true,User})
})

router.get('/about',(req,res)=>{
  let User = req.session.user
  res.render('user/about',{user: true,userfot: true,User})
})

router.get('/product',verifyLogin,(req,res)=>{
  let User = req.session.user
  productHelpers.getAllProduct().then((products)=>{
    console.log(products);
  res.render('user/product',{user: true,userfot: true,User,products})
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



router.get("/cart",async (req, res,next) => {
  console.log('lllllllll')
  try {
    let products = await userHelpers.getCartProducts(req.session.user._id);
    console.log(products,"hhhhhhhhhh")

    //let total = await userHelpers.getTotalAmount(req.session.user._id);


    let cartCount = null;
    if (req.session.user) {
      cartCount = await userHelpers.getCartCount(req.session.user._id);
    }
    // let wishCount = null;
    // if (req.session.user) {
    //   wishCount = await userHelpers.getWishCount(req.session.user._id);
    // }

    userDetails = req.session.user;
    res.render("user/cart", {
      user: true,
     
      products,
      userDetails,
      cartCount,
     
    });
  } catch (error) {
    next(error);
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

///////////////////cart qty innc dic////////////// 

router.get('/incQty/:id',(req,res)=>{
  let incId=res.params.id
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


module.exports = router;
