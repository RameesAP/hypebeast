const express = require('express');
const { response } = require('../app');
const router = express.Router();
const userHelper = require('../helpers/user-helpers')

const twillioHelper = require('../helpers/twillio-helpers')
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');
const couponHelpers = require('../helpers/coupon-helpers');
const categoryHelpers = require('../helpers/category-helpers')
/* GET home page. */

//middlewware

const verifyLogin = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/login')
  }
};

// productHelpers.getAllProduct().then((products)=>{
//   console.log(products);
//   res.render('user/view-products' ,{ user: true,userfot: true,products})
// })


router.get('/', async (req, res, next) => {
  try {

    let User = req.session.user
    let category = await categoryHelpers.getAllCategory()
    if (req.session.user) {

      console.log(category, "userrrrrr category")
      let cartCount = await userHelper.getCartCount(req.session.user._id)
      let wishlistCount = await userHelper.getWishlistCount(req.session.user._id)
      console.log(cartCount);
      productHelpers.getAllProduct().then((products) => {
        console.log(products);
        productHelpers.getAllBanners().then((banner) => {
          console.log(banner, "banner is here");


          res.render('user/index', { user: true, userfot: true, User, category, products, banner, cartCount, wishlistCount });

        })
      })
      // res.render('user/index', { user: true,userfot: true,User });
    }
    else {
      productHelpers.getAllBanners().then((banner) => {
        productHelpers.getAllProduct().then((products) => {
          res.render("user/index", { products, banner, category })
        })
      })
    }

  } catch (error) {
    next(error)
  }



});

router.get('/login', (req, res, next) => {
  try {
    if (req.session.loggedIn) {
      res.redirect('/')
    } else {

      res.render('user/login', { user: false, "loginErr": req.session.loginErr });
      req.session.loginErr = false
    }

  } catch (error) {
    next(error)
  }

});

router.get('/signin', (req, res) => {
  try {
    res.render('user/signin', { user: false })
  } catch (error) {
    next(error)
  }

});

// router.get('/otp', (req, res) => {
//   res.render('user/otp')
// });

router.get('/otp', (req, res) => {
  try {
    res.render('user/otp')
  } catch (error) {
    next(error)
  }

})


router.post('/signin', (req, res) => {
  console.log("aaaaaaaaaaaaaa");
    userHelper.verifyUser(req.body).then((response) => {
      console.log("bbbbbbbbbbbbbbbb");
      console.log(response);
      if (response.status) {
        req.session.body = req.body
        console.log(req.body);
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
 
  //  console.log(req.body);




}),


  //otp


  router.post('/otp', (req, res) => {
    try {
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

    } catch (error) {
      next(error)
    }




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
    try {
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
    } catch (error) {
      next(error)
    }
    // console.log(req.body);

  });

//navebar control

router.get('/logout', (req, res) => {
  try {
    req.session.destroy()
    res.redirect('/')
  } catch (error) {
    next(error)
  }

});



router.get('/contact', (req, res) => {
  try {
    let User = req.session.user
    res.render('user/contact', { user: true, userfot: true, User })
  } catch (error) {
    next(error)
  }

})


router.get('/about', (req, res) => {
  try {
    let User = req.session.user
    res.render('user/about', { user: true, userfot: true, User })
  } catch (error) {
    next(error)
  }

})

router.get('/product', verifyLogin, async (req, res) => {
  try {
    let User = req.session.user
    let wishlistCount = await userHelper.getWishlistCount(req.session.user._id)
    cartCount = await userHelpers.getCartCount(req.session.user._id);
    categoryHelpers.getAllCategory().then((category) => {
      productHelpers.getAllProduct().then((products) => {
        // console.log(products);
        res.render('user/product', { user: true, userfot: true, category, User, products, cartCount, wishlistCount })
      })
    })
  } catch (error) {
    next(error)
  }

})

router.get('/product/:id', verifyLogin, (req, res) => {
  try {
    console.log(req.params.id, "hhhhhhhhhhhhhhhhhhh");
    if (req.session.user) {
      categoryHelpers.getByCategory(req.params.id).then((listcategory) => {
        // let User = req.session.user
        console.log(listcategory);


        console.log(listcategory, "listcategory");
        // let userid = req.session.user._id;
        categoryHelpers.getAllCategory().then((category) => {
          // console.log(category,"category");
          userHelpers.getCartCount().then((cartcount) => {
            userHelpers.getWishlistCount().then((wishlistCount) => {
              productHelpers.getAllProduct().then((products) => {
                // console.log({cartcount,listcategory,wishlistCount,category});
                res.render('user/categorybaseproducts', { user: true, cartcount, listcategory, wishlistCount, category })
              })

            })
          })
        })
      })
    }
  } catch (error) {
    next(error)
  }

})


router.get('/product-page', (req, res) => {
  try {
    let User = req.session.user
    res.render('user/product-detail', { user: true, userfot: true, User })
  } catch (error) {
    next(error)
  }
})

// router.get('/modal/:id',(req,res)=>{
//   let id = req.params.id
// productHelpers.getModal(id).then((response)=>{
//   console.log(response,"ttttttttttttttttttttttttttt")
// })
// })




//////////////////my account////////////////////////


router.get('/deleteAddress/:id', (req, res, next) => {
  let addressId = req.params.id
  console.log(addressId, "hhhhhhhhhhhhhhhhhhhhhhhoi");
  userHelpers.deleteAddress(addressId).then((response) => {
    res.redirect('/myaccount')
  }).catch((err) => {
    next(err)
  })
})


router.get('/editAddress/:id', async (req, res) => {
  try {
    console.log('hooi');
    let addressId = req.params.id
    // let getedAddress =await userHelpers.getAddress()
    console.log(addressId);
    let address = await userHelpers.editAddress(addressId)
    res.render('/editAddress', { user: true, userfot: true, address })
  } catch (error) {
    next(error)
  }

})


router.post('/editAddress/:id', (req, res) => {
  try {
    let addressId = req.params.id
    console.log('jjjjjj');
    userHelpers.updateAddress(addressId, req.body).then((response) => {
      res.redirect('/myaccount')
    })
  } catch (error) {
    next(error)
  }

})





router.get('/editprofile/:id', async (req, res) => {
  try {
    console.log('edit profileeeeeeeeeeeeeeeeeee');
    let userId = req.params.id
    console.log(userId);
    let User = req.session.user
    let UserEdit = await userHelpers.editUser(userId)
    res.render('user/edit-profile', { user: true, userfot: true, User, UserEdit })
  } catch (error) {
    next(error)
  }

})



router.get('/editpassword', (req, res) => {
  try {
    let User = req.session.user
    res.render('user/edit-password', { user: true, userfot: true, User })
  } catch (error) {
    next(error)
  }

})


router.get('/address', (req, res) => {
  try {
    let User = req.session.user
    console.log('pettttttttt');
    res.render('user/add-address', { user: true, userfot: true, User })
  } catch (error) {
    next(error)
  }

})

router.post('/add-address', (req, res) => {
  try {
    console.log('Addressssssssssssssss');
    console.log(req.body, 'req.body');
    userHelpers.insertAddress(req.body, req.session.user._id).then((response) => {

      res.redirect('/myaccount')
    })
  } catch (error) {
    next(error)
  }

})

router.get('/myaccount', (req, res) => {
  try {
    let User = req.session.user
    let userId = req.session.user._id
    userHelper.viewAddress(userId).then((address) => {
      res.render('user/myaccount', { user: true, userfot: true, address, User })
      // res.render('user/myaccount',{user: true,userfot: true,User})
    })
  } catch (error) {
    next(error)
  }

  // res.render('user/myaccount',{user: true,userfot: true,User})
})




//modal

router.get('/singleProduct/:id', (req, res) => {
  try {
    let id = req.params.id
    productHelpers.getSingleProduct(id).then((product) => {
      console.log(product)
      res.json(product)
    })
  } catch (error) {
    next(error)
  }

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


router.get("/cart", async (req, res, next) => {
  try {
    console.log("ssssddd");

    let products = await userHelpers.getCartProducts(req.session.user._id);
    let cartProd = products.cartItems
    cartempty = products.cartempty

    console.log(cartProd, "car products");

    let total = await userHelpers.getTotalAmount(req.session.user._id);
    let wishlistCount = await userHelper.getWishlistCount(req.session.user._id)
    console.log(total);
    let totalPrice = total.map((value) => {
      return value.total
    })


    let price = totalPrice.reduce((price, currentValue) => {
      price[currentValue] = currentValue;
      return price;
    }, {});
    req.session.totalPrice = Object.keys(price)
    let cartCount = null;
    if (req.session.user) {
      cartCount = await userHelpers.getCartCount(req.session.user._id);
    }

    userDetails = req.session.user;
    let User = req.session.user
    res.render("user/cart", { user: true, userfot: true, total, cartProd, userDetails, cartCount, User, wishlistCount, cartempty });
  } catch (error) {
    next(error);
  }


});

router.post("/add-to-cart", (req, res, next) => {
  try {
    console.log(req.body, "rameees");
    userHelpers.addToCart(req.body, req.session.user._id).then(() => {
      // res.redirect("/");

      res.json({ status: true });
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/delete-cartProduct/:id', (req, res) => {
  try {
    let prodId = req.params.id
    console.log(prodId, "llllllllllllllllllllllllllllllllll");
    const userId = req.session.user._id
    userHelpers.deleteCart(userId, prodId).then((response) => {
      res.redirect('/cart')
    })
  } catch (error) {
    next(error);
  }

})

///////////////////cart qty innc dic////////////// 

router.post('/incQty/:id', (req, res) => {
  try {
    let incId = req.params.id
    
    userHelpers.incrementQty(incId, req.session.user._id).then((response) => {

      res.json({ response })
    })
  } catch (error) {
    next(error);
  }
})

router.post('/decQty/:id', (req, res) => {
  try {
    let decId = req.params.id
    console.log(decId, "asassdfffffff")
    userHelpers.decrimentQty(decId, req.session.user._id).then((response) => {

      res.json({ response })
    })
  } catch (error) {
    next(error);
  }

})



////////////////////////////wishlist///////////////////////////////////


router.get('/wishlist', async (req, res) => {
  try {
    let User = req.session.user
    let wishlistitems = await userHelpers.getWishlistProducts(req.session.user._id);
    let wishlistCount = await userHelper.getWishlistCount(req.session.user._id)
    cartCount = await userHelpers.getCartCount(req.session.user._id);
    res.render('user/wishlist', { user: true, userfot: true, User, wishlistCount, cartCount, wishlistitems })
  } catch (error) {
    next(error);
  }


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

router.get('/delete-wishlistProduct/:id', (req, res) => {
  try {
    let prodId = req.params.id
    
    const userId = req.session.user._id
    userHelpers.deleteWishlist(userId, prodId).then((response) => {
      res.redirect('/wishlist')
    })
  } catch (error) {
    next(error);
  }

})




////////////////////////////Checkout form//////////////////////////////////////////



router.get('/checkout', async (req, res) => {
  try {
    let User = req.session.user
    let userId = req.session.user._id

    let products = await userHelpers.getCartProducts(req.session.user._id);
    let cartProd = products.cartItems
    let cartCount = await userHelper.getCartCount(req.session.user._id)
    let wishlistCount = await userHelper.getWishlistCount(req.session.user._id)
    let getcoupon = await couponHelpers.getAllCoupon(req.session.user._id)
    // console.log(products, "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhllllllllllllllllllllllllllllllllllllllllll");
    let total = await userHelpers.getTotalAmount(req.session.user._id);
    //console.log(getcoupon,"hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhoiiiiiiiiii");
    userHelpers.viewAddress(userId).then((address) => {
      res.render('user/checkout2', { user: true, userfot: true, address, User, total, userId, cartCount, products, getcoupon, wishlistCount, cartProd })
      // res.render('user/myaccount',{user: true,userfot: true,User})
    })
  } catch (error) {
    next(error);
  }

  // res.render('user/myaccount',{user: true,userfot: true,User})
})






// router.post('/checkOutPost',(req,res)=>{
//   console.log(req.body,'111111111111111111111111');
//   let userId= req.session.user._id

//   let paymentDetails = req.body.paymentDetails
//   let deliveryDetails = req.body.deliveryDetails
//   let productid=req.body.productid

//   let grandTotal = req.session.grandTotal
//   let discountAmount = req.session.discount
//   userHelpers.confirmOrder(userId,paymentDetails,deliveryDetails,productid,grandTotal,discountAmount).then((orderDetails)=>{
//     console.log(orderDetails);
//     res.json(orderDetails)
//   })
// })


router.post('/checkOutPost', (req, res) => {
  try {
    console.log(req.body, '111111111111111111111111');
    let userId = req.session.user._id

    let paymentDetails = req.body.paymentDetails
    let deliveryDetails = req.body.deliveryDetails
    let productid = req.body.productid
    if (req.session.coupen) {
      let grandTotal = req.session.grandTotal
      let discountAmount = req.session.discount
      userHelpers.confirmOrder(userId, paymentDetails, deliveryDetails, productid, grandTotal, discountAmount).then((orderDetails) => {
        console.log(orderDetails, "jjjjjjjjjjjjjjjjj");
        if (req.body['paymentDetails'] === 'cod') {
          res.json({ codSuccess: true })
        } else {
          userHelpers.generateRazorpay(orderDetails._id, orderDetails.grandTotal).then((response) => {
            res.json(response)
          })
        }

        // res.json(orderDetails)
      })
    } else {
      let totalPrice = req.session.totalPrice
      console.log(totalPrice, "totalPrice")
      userHelpers.confirmOrder(userId, paymentDetails, deliveryDetails, productid, "", "", totalPrice).then((orderDetails) => {
        console.log(orderDetails, "orderDetails");
        if (req.body['paymentDetails'] === 'cod') {
          res.json({ codSuccess: true })
        } else {
          // console.log(orderDetails,"5555555555555555555555");
          userHelpers.generateRazorpay(orderDetails._id, orderDetails.totalPrice[0]).then((response) => {
            res.json(response)
          })
        }
        // res.json(orderDetails)
      })
    }
  } catch (error) {
    next(error);
  }


})






////////////////////////////////////////////coupon///////////////////////




router.post('/applyCoupen', (req, res, next) => {
  console.log(req.body, "llllllllllll")
  let userId = req.session.user._id
  couponHelpers.applyCoupen(userId, req.body).then((response) => {
    console.log(response, "ggggg11111111111111111111111111111111111111111111111111111111111");
    req.session.response = response
    if (response) {
      req.session.coupen = response.coupen
      req.session.discount = response.discount
      req.session.grandTotal = response.grandTotal
    }
    res.json(response.grandTotal)
  }).catch((err) => {
    next(err)
  })
})




////////////////////////////////////codDelivery//////////////////

router.get('/coddelivery', async (req, res) => {
  try {
    let userId = req.session.user._id
    // let orderDetails = await userHelpers.codesuccess()

    res.render('user/codDelivery', { user: true, userfot: true, userId })
  } catch (error) {
    next(error);
  }

})


router.get('/orders', async (req, res ,next) => {
  try {
    let userId = req.session.user._id

    let orderDetails = await userHelpers.codesuccess(userId)
    console.log(orderDetails, "yyyyyyyu");
    res.render('user/orders', { user: true, userfot: true, orderDetails, userId })
  } catch (error) {
    next(error);
  }

})


router.post('/verify-payment', (req, res) => {
  try {
    console.log(req.body, "5555555555555555");
    userHelpers.verifyPayment(req.body).then(() => {
      console.log(req.body, "verifypayment");
      userHelpers.changePaymentStatus(req.body['receipt']).then(() => {
        console.log("payment successfull");
        res.json({ status: true })
      })
    }).catch((err) => {
      console.log(err);
      res.json({ status: false, errMsg: '' })
    })
  } catch (error) {
    next(error);
  }

})

router.get('/cartempty', (req, res) => {
  try {
    res.render('user/cart_empty', { user: true })
  } catch (error) {
    next(error);
  }

})

router.get('/order-details',(req,res)=>{
  try {
    res.render('user/order-details',{user: true})
  } catch (error) {
    next(error);
  }
})






module.exports = router;
