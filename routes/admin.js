const express = require('express');
const { response, routes } = require('../app');
const adminHelpers = require('../helpers/admin-helpers');
const userHelpers = require('../helpers/user-helpers');
const categoryHelpers = require('../helpers/category-helpers');
const productHelpers = require('../helpers/product-helpers');
const couponHelpers = require('../helpers/coupon-helpers')
const router = express.Router();

const path=require('path')
const multer=require('multer');
const { log } = require('console');
// const file = require('fileupload/lib/modules/file');
const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,'public/product-image')
  },

  filename:(req,file,cb)=>{
    console.log(file);
    cb(null,Date.now() + path.extname(file.originalname))
  }

})
const upload=multer({storage:storage})





/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.session.admin) {
    res.render('admin/index', { layout: 'adminLayout', admin: true })
  } else {
    res.redirect('/admin/signin')
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
router.post('/add-products',upload.array("images",3),(req, res)=>{
  console.log('hellooooooooooooooooooooooooooooooooooo');
  const images=req.files
  let array=[]
  array=images.map((value)=>value.filename);
  req.body.image=array;
  console.log(req.body,'req.body');
    productHelpers.insertProducts(req.body).then((response)=>{
      res.redirect('/admin/product-mang')
    })
  })

//admin login

router.get('/signin', (req, res, next) => {
  res.render('admin/signin', { layout: 'adminLayout', admin: null })
});


//adminlogin post method

router.post('/signin', (req, res) => {
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
})



router.get('/widget', (req, res, next) => {
  res.render('admin/widget', { layout: 'adminLayout', admin: true })
});
router.get('/form', (req, res, next) => {
  res.render('admin/form', { layout: 'adminLayout', admin: true })
});


router.get('/dashboard', (req, res, next) => {
  res.render('admin/index', { layout: 'adminLayout', admin: true })
});





router.get('/product-mang', async(req, res, next) => {
  productDetails=await productHelpers.viewProducts()
  console.log(productDetails,'product-mang');

  res.render('admin/product-mang', { layout:'adminLayout',admin:true,productDetails })
});

router.get('/user-mang', async (req, res, next) => {
  let users = await userHelpers.getUsers()
  res.render('admin/user-mang', { layout: 'adminLayout', admin: true, users })
});

router.get('/add-product',async (req, res, next) => {
  let cat = await categoryHelpers.getCategory()
  res.render('admin/add-product', { layout: 'adminLayout', admin: true,cat})
});




//user block and active

router.get('/user-block/:id', (req, res) => {
  let userId = req.params.id;
  adminHelpers.blockUser(userId).then((response) => {
    res.redirect('/admin/user-mang')
  })
})

router.get('/user-active/:id', (req, res, next) => {
  let userId = req.params.id;
  adminHelpers.activeUser(userId).then((response) => {
    res.redirect('/admin/user-mang')
  })
})


/////////////////////////////category//////////////////////

router.get('/category-mang',async (req,res)=>{
  let category =await categoryHelpers.getAllCategory()
    res.render('admin/category-mang',{layout:'adminLayout',admin:true,category})
  
 
})

router.get('/add-category',(req,res)=>{
  
  res.render('admin/add-category',{layout:'adminLayout',admin:true})
})

router.post('/add-category',(req,res)=>{
  console.log(req.body);
  let category = categoryHelpers.addCategory(req.body)
  res.redirect('/admin/category-mang')
})

router.get('/category-delete/:id',(req,res)=>{
  let catId = req.params.id
  let categoryDel = categoryHelpers.categoryDel(catId)
  res.redirect('/admin/category-mang')
})


//product delete

router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/product-mang')
  })
})

//edit

router.get('/edit-product/:id',async (req,res)=>{
  console.log('ho');
  let proId =req.params.id
  let category =await categoryHelpers.getAllCategory()
  console.log(proId);
 let product= await productHelpers.editproduct(proId)
    res.render('admin/edit-product',{layout:'adminLayout',admin:true,product,category})
  })
  

  // router.post('/edit-product/:id',(req,res)=>{
  //  let proId =req.params.id
  //  console.log(proId,'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk');
  //   productHelpers.updateProduct(proId,req.body).then(()=>{
  //     res.redirect('/admin/product-mang')
      
  //   })

   

  // })

  


  router.post('/edit-product/:id',upload.array("image",3),(req,res)=>{
    let proId =req.params.id
    console.log("jjjjjj")
    const images=req.files
    console.log(images);
    let array=[]
    array=images.map((value)=>value.filename);
    req.body.image=array;
    console.log(req.body,'req.body');
    productHelpers.updateProduct(proId,req.body).then((response)=>{
      res.redirect('/admin/product-mang')
    })
  })




///////////////////bannner mang

  router.get('/banner', async(req, res, next) => {
    bannerDetails= await productHelpers.viewBanners()
    console.log(bannerDetails,'banner')
    res.render('admin/banner', { layout: 'adminLayout', admin: true ,bannerDetails})
  });

  router.get('/add-banner',async (req, res, next) => {
    res.render('admin/add-banner', { layout: 'adminLayout', admin: true})
  });



 
   router.post('/add-banner',upload.array("images",3),(req,res)=>{
      console.log("banner immageeeeeeeeeeee");
      const images=req.files
      let array=[]
      array=images.map((value)=>value.filename);
      req.body.image=array;
      console.log(req.body,'req.body');
      productHelpers.bannerAdd(req.body).then((response)=>{
        res.redirect('/admin/banner')
      })
  });


  router.get('/delete-banner/:id',(req,res)=>{
    let bannerId=req.params.id
    console.log(('lllllllllllllllllll'));
    console.log(bannerId);
    productHelpers.deleteBanner(bannerId).then((response)=>{
      res.redirect('/admin/banner')
    })
  })

  router.get('/edit-banner/:id',async(req,res)=>{
    console.log('hooooooooooi');
    let bannerId=req.params.id
    console.log(bannerId);
    let banner=await productHelpers.editBanner(bannerId)
    res.render('admin/edit-banner',{layout:'adminLayout',admin:true,banner})
  })

  router.post('/edit-banner/:id',upload.array("image",3),(req,res)=>{
    let bannerId=req.params.id
    console.log("hoooooooooooooooooooooooooi");
    const images=req.files
    console.log(images);
    let array=[]
    array=images.map((value)=>value.filename);
    req.body.image=array;
    console.log(req.body,'req.body');
    productHelpers.updateBanner(bannerId,req.body).then((response)=>{
      res.redirect('/admin/banner')
    })
  })



  ////////////////////////////coupon////////////////////////////////

  router.get('/coupon-table',async(req,res)=>{
   let allCoupon = await couponHelpers.getAllCoupon()
    console.log(allCoupon);
    res.render('admin/coupon-table',{layout:'adminLayout',admin:true,allCoupon})
  })
  

  router.get('/add-coupon',(req,res)=>{
   
    res.render('admin/add-coupon',{layout:'adminLayout',admin:true})
  })


  router.post('/add-coupon',(req,res)=>{
  console.log(req.body,"jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
  let coupon = couponHelpers.addCoupon(req.body)
  console.log(coupon);
  res.redirect('/admin/coupon-table')
  })


  router.get('/delete-coupon/:id',(req,res)=>{
    let couponId = req.params.id
    let couponDelete = couponHelpers.couponDelete(couponId)
    res.redirect('/admin/coupon-table')
  })



module.exports = router;
