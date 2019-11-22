const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const app = express();
dotenv.config();
const port = process.env.PORT || 3000;


// Controllers
const confirmController = require('./controllers/confirmController')
const checkAdmin = require('./middlewares/checkAdmin');
const adminController = require('./controllers/adminController');
const indexController = require('./middlewares/unitList');
const unitsController = require('./controllers/unitsController');
const authController = require('./controllers/authController');

// Set up express to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'keepitsecret', saveUninitialized: false, resave: false }));

// Static assests
app.use(express.static(path.join(__dirname, '/public/')));
// views & view engine
app.set('views', path.join(__dirname, '/views/'));
app.set('view engine', 'ejs');
app.use((req, res, next) => {
  res.locals.result = {
    query: req.query
  };
  res.locals.message = '';
  next();
});



app.get('/logout', (req, res, next) => {
  req.session.auth = null;
  res.redirect('/auth');
});
app.use('/confirm', confirmController);

app.use('/auth', authController);
app.use('/units', unitsController);
app.use('/admin', checkAdmin, adminController);
app.use('/', indexController);

app.use((req, res, next) => {
  return res.render('error', { message: 'Oops! It looks like you missed your way' });
});

app.listen(port, () => {
  console.log(`App running on :  ${port}`);
});