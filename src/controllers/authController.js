const express = require('express');



const Model = require('../models/model');
// const checkAdmin = require('../middlewares/checkAdmin');
// const Qualifier = new Model('qualifiers');
const Unit = new Model('units');
const router = express.Router();



router.get('/', (req, res) => {

  return res.render('auth');
});

router.post('/', (req, res) => {
  const admin = req.body;
  if (process.env.ADMIN_USERNAME === admin.username && process.env.ADMIN_PWD === admin.password) {
    req.session.auth = admin;
    return res.redirect('/admin');
  } else {
    let output = {
      result: {
        message: `Auth Failed`
      }

    };
    return res.render('auth', output)
  }

});







module.exports = router;