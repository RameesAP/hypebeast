const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const usersRouter = require('./routes/users');
const adminRouter = require('./routes/admin');

const hbs = require('express-handlebars')
const multer = require('multer');
const app = express();

const dotenv = require("dotenv")
dotenv.config({path: './config.env'})


const db = require('./config/connection')
const fileStorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/product-image')
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, Date.now() + '--' + file.originalname)
  }
})
const upload = multer({ storage: fileStorageEngine });

const session = require('express-session')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.post('/multiple', (req, res) => {
  console.log(req.files);
  res.send('multiple')
})


app.engine('hbs', hbs.engine({
  extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layout/', partialsDir: __dirname + '/views/partials/',
  helpers: {
    eq: function (v1, v2) { return v1 === v2; },
    gt: function (v1, v2) { return v1 > v2; },
    ne: function (v1, v2) { return v1 !== v2; },
    lt: function (v1, v2) { return v1 < v2; },
    lte: function (v1, v2) { return v1 <= v2; },
    gte: function (v1, v2) { return v1 >= v2; },
    and: function (v1, v2) { return v1 && v2; },
    or: function (v1, v2) { return v1 || v2; },

    subTotal: function (price, quantity) {
      return price * quantity
    },

    splize: function (value) {
      let val = value + ""
      return val.slice(5, 7)
    }

  }
}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(fileUpload())
app.use(session({ secret: "Key", cookie: { maxAge: 600000 } }))
db.connect((err) => {
  if (err)
    console.log('connection error' + err);

  else
    console.log('database Connected to port 27017');

})

app.use('/', usersRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('user/error');
});

module.exports = app;
