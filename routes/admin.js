const express = require('express');
const { response, routes } = require('../app');
const adminHelpers = require('../helpers/admin-helpers');
const userHelpers = require('../helpers/user-helpers');
const categoryHelpers = require('../helpers/category-helpers');
const productHelpers = require('../helpers/product-helpers');
const couponHelpers = require('../helpers/coupon-helpers')
const router = express.Router();

const path = require('path')
const multer = require('multer');
const { log } = require('console');
const createError = require('http-errors');

// const file = require('fileupload/lib/modules/file');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/product-image')
  },

  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname))
  }

})
const upload = multer({ storage: storage })





/* GET users listing. */
router.get('/', function (req, res, next) {
  try {
    if (req.session.admin) {
      res.render('admin/index', { layout: 'adminLayout', admin: true })
    } else {
      res.redirect('/admin/signin')
    }
  } catch (error) {
    next(error)
  }


});

//add product
// router.post('/add-product',upload.array('images',3),(req,res)=>{
//   console.log("hello");
//   const images=req.file
//   let array=[]
//   array=images.map((value)=>value.filename);
//   req.body.image=array;
//   console.log(req.body);
//   productHelper.insertProducts(req.body).then((response)=>{
//     res.redirect('/admin/product-mang')
//   })

// })

//multer
router.post('/add-products', upload.array("images", 3), (req, res) => {
  try {
    console.log('hellooooooooooooooooooooooooooooooooooo');
    const images = req.files
    let array = []
    array = images.map((value) => value.filename);
    req.body.image = array;
    console.log(req.body, 'req.body');
    productHelpers.insertProducts(req.body).then((response) => {
      res.redirect('/admin/product-mang')
    })
  } catch (error) {
    next(error)
  }

})

//admin login

router.get('/signin', (req, res, next) => {
  try {
    res.render('admin/signin', { layout: 'adminLayout', admin: null })
  } catch (error) {
    next(error)
  }

});


//adminlogin post method

router.post('/signin', (req, res) => {
  try {
    console.log(req.body);
    adminHelpers.doAdminLogin(req.body).then((response) => {
      if (response.status) {
        req.session.loggedIn = true
        req.session.admin = response.admin
        res.redirect('/admin')
      } else {
        req.session.loginErr = true
        res.redirect('/signin')
      }
    })
  } catch (error) {
    next(error)
  }

})



router.get('/widget', (req, res, next) => {
  try {
    res.render('admin/widget', { layout: 'adminLayout', admin: true })
  } catch (error) {
    next(error)
  }

});
router.get('/form', (req, res, next) => {
  try {
    res.render('admin/form', { layout: 'adminLayout', admin: true })
  } catch (error) {
    next(error)
  }

});


router.get('/dashboard', (req, res, next) => {
  try {
    res.render('admin/index', { layout: 'adminLayout', admin: true })
  } catch (error) {
    next(error)
  }

});





router.get('/product-mang', async (req, res, next) => {
  try {
    productDetails = await productHelpers.viewProducts()
    console.log(productDetails, 'product-mang');

    res.render('admin/product-mang', { layout: 'adminLayout', admin: true, productDetails })
  } catch (error) {
    next(error)
  }

});

router.get('/user-mang', async (req, res, next) => {
  try {
    let users = await userHelpers.getUsers()
    res.render('admin/user-mang', { layout: 'adminLayout', admin: true, users })
  } catch (error) {
    next(error)
  }

});

router.get('/add-product', async (req, res, next) => {
  try {
    let cat = await categoryHelpers.getCategory()
    res.render('admin/add-product', { layout: 'adminLayout', admin: true, cat })
  } catch (error) {
    next(error)
  }

});




//user block and active

router.get('/user-block/:id', (req, res) => {
  try {
    let userId = req.params.id;
    adminHelpers.blockUser(userId).then((response) => {
      res.redirect('/admin/user-mang')
    })
  } catch (error) {
    next(error)
  }

})

router.get('/user-active/:id', (req, res, next) => {
  try {
    let userId = req.params.id;
    adminHelpers.activeUser(userId).then((response) => {
      res.redirect('/admin/user-mang')
    })
  } catch (error) {
    next(error)
  }

})


/////////////////////////////category//////////////////////

router.get('/category-mang', async (req, res) => {
  try {
    let category = await categoryHelpers.getAllCategory()
    console.log(category, "sdfdfdsfdsf")
    res.render('admin/category-mang', { layout: 'adminLayout', admin: true, category })
  } catch (error) {

  }



})

router.get('/add-category', (req, res) => {
  try {
    res.render('admin/add-category', { layout: 'adminLayout', admin: true })
  } catch (error) {
    next(error)
  }


})

router.post('/add-category', upload.array("catimages"), (req, res) => {
  try {
    const images = req.files
    let array = []
    array = images.map((value) => value.filename)
    req.body.catimages = array
    console.log(req.body, "req,body");
    categoryHelpers.addCategory(req.body).then((response) => {
      res.redirect('/admin/category-mang')
    })
  } catch (error) {
    next(error)
  }


})

router.get('/category-delete/:id', (req, res) => {
  try {
    let catId = req.params.id
    let categoryDel = categoryHelpers.categoryDel(catId)
    res.redirect('/admin/category-mang')
  } catch (error) {
    next(error)
  }

})


///////////product delete

router.get('/delete-product/:id', (req, res) => {
  try {
    let proId = req.params.id
    console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
    console.log(proId);
    productHelpers.deleteProduct(proId).then((response) => {
      res.redirect('/admin/product-mang')
    })
  } catch (error) {
    next(error)
  }

})

//edit

router.get('/edit-product/:id', async (req, res) => {
  try {
    console.log('ho');
    let proId = req.params.id
    let category = await categoryHelpers.getAllCategory()
    console.log(proId);
    let product = await productHelpers.editproduct(proId)
    res.render('admin/edit-product', { layout: 'adminLayout', admin: true, product, category })
  } catch (error) {
    next(error)
  }

})


// router.post('/edit-product/:id',(req,res)=>{
//  let proId =req.params.id
//  console.log(proId,'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
//   productHelpers.updateProduct(proId,req.body).then(()=>{
//     res.redirect('/admin/product-mang')

//   })



// })




router.post('/edit-product/:id', upload.array("image", 3), (req, res) => {
  try {
    let proId = req.params.id
    console.log("jjjjjj")
    const images = req.files
    console.log(images);
    let array = []
    array = images.map((value) => value.filename);
    req.body.image = array;
    console.log(req.body, 'req.body');
    productHelpers.updateProduct(proId, req.body).then((response) => {
      res.redirect('/admin/product-mang')
    })
  } catch (error) {

  }

})




///////////////////bannner mang

router.get('/banner', async (req, res, next) => {
  try {
    bannerDetails = await productHelpers.viewBanners()
    console.log(bannerDetails, 'banner')
    res.render('admin/banner', { layout: 'adminLayout', admin: true, bannerDetails })
  } catch (error) {
    next(error)
  }

});

router.get('/add-banner', async (req, res, next) => {
  try {
    res.render('admin/add-banner', { layout: 'adminLayout', admin: true })
  } catch (error) {
    next(error)
  }

});




router.post('/add-banner', upload.array("images", 3), (req, res) => {
  try {
    console.log("banner immageeeeeeeeeeee");
    const images = req.files
    let array = []
    array = images.map((value) => value.filename);
    req.body.image = array;
    console.log(req.body, 'req.body');
    productHelpers.bannerAdd(req.body).then((response) => {
      res.redirect('/admin/banner')
    })
  } catch (error) {
    next(error)
  }

});


router.get('/delete-banner/:id', (req, res) => {
  try {
    let bannerId = req.params.id
    console.log(('lllllllllllllllllll'));
    console.log(bannerId);
    productHelpers.deleteBanner(bannerId).then((response) => {
      res.redirect('/admin/banner')
    })
  } catch (error) {
    next(error)
  }

})

router.get('/edit-banner/:id', async (req, res) => {
  try {
    console.log('hooooooooooi');
    let bannerId = req.params.id
    console.log(bannerId);
    let banner = await productHelpers.editBanner(bannerId)
    res.render('admin/edit-banner', { layout: 'adminLayout', admin: true, banner })
  } catch (error) {
    next(error)
  }

})

router.post('/edit-banner/:id', upload.array("image", 3), (req, res) => {
  try {
    let bannerId = req.params.id
    console.log("hoooooooooooooooooooooooooi");
    const images = req.files
    console.log(images);
    let array = []
    array = images.map((value) => value.filename);
    req.body.image = array;
    console.log(req.body, 'req.body');
    productHelpers.updateBanner(bannerId, req.body).then((response) => {
      res.redirect('/admin/banner')
    })
  } catch (error) {
    next(error)
  }

})



////////////////////////////coupon////////////////////////////////

router.get('/coupon-table', async (req, res) => {
  try {
    let allCoupon = await couponHelpers.getAllCoupon()
    console.log(allCoupon);
    res.render('admin/coupon-table', { layout: 'adminLayout', admin: true, allCoupon })
  } catch (error) {
    next(error)
  }

})


router.get('/add-coupon', (req, res) => {
  try {

    res.render('admin/add-coupon', { layout: 'adminLayout', admin: true })
  } catch (error) {
    next(error)
  }

})


router.post('/add-coupon', (req, res) => {
  try {
    console.log(req.body, "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
    let coupon = couponHelpers.addCoupon(req.body)
    console.log(coupon);
    res.redirect('/admin/coupon-table')
  } catch (error) {

  }

})


router.get('/delete-coupon/:id', (req, res) => {
  try {
    let couponId = req.params.id
    let couponDelete = couponHelpers.couponDelete(couponId)
    res.redirect('/admin/coupon-table')
  } catch (error) {
    next(error)
  }

})

router.get('/order-mang', async (req, res) => {
  try {
    let viewAllOrders = await adminHelpers.viewAllOrders()
    console.log(viewAllOrders, "viewAllOrders");
    res.render('admin/order-mang', { layout: 'adminLayout', admin: true, viewAllOrders })
  } catch (error) {
    next(error)
  }

})

router.get('/ordered-prod/:id',async(req,res,next)=>{
  try {
    productId=req.params.id
    singleproduct= await productHelpers.getProductDetails(productId)
    console.log(singleproduct,'single');

    res.render('admin/ordered-prod', { layout: 'adminLayout', admin: true,singleproduct })
  } catch (error) {
    next(error)
  }
})



router.post('/productShip', (req, res) => {
  // let id = req.body.data
  console.log(req.body,"idddddddddddddddddddddddddddddddd");
  productHelpers.shipProduct(req.body.id).then((response) => {

    res.json({ response })

  })
})

router.post('/productDeliver', (req, res) => {
  // let id = req.params.id
  console.log(req.body,"iddddddddddddddddddddliver");
  productHelpers.deliverProduct(req.body.id).then((response) => {

    res.json({ response })
  })
})

router.post('/cancelOrder', (req, res) => {
  // let id = req.params.id
  console.log(req.body,"iddddddddddddddddddddliver");
  productHelpers.cancelOrder(req.body.id).then((response) => {
    res.json({ response })
  })
})










router.use(function (req, res, next) {
  next(createError(404));
});

// error handler
router.use(function (err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('admin/error', { layout: 'adminLayout' });
});








module.exports = router;
