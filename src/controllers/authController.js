const express = require('express');



const Model = require('../models/model');
// const checkAdmin = require('../middlewares/checkAdmin');
// const Qualifier = new Model('qualifiers');
const Unit = new Model('units');
const router = express.Router();



router.get('/', (req, res) => {
  console.log('su admin : ', req.params)
  return res.render('auth');
});



router.get('/admin', (req, res) => {

  if (req.query.unit_list) {

  }
  const data = {
    result: {
      query: req.query
    }
  };
  return res.render('admin', data);
});


router.post('/admin', (req, res) => {

  console.log(req.body);
  const text = `INSERT INTO units (unit_id, unit) VALUES ($1, $2)`;
  const values = [
    req.body.unit_id,
    req.body.unit
  ];
  Unit.insertQuery(text, values).then(({ rows }) => {
    const data = {
      result: {
        message: 'Inserted successfully',
        data: rows[0]
      }
    };
    return res.render('admin', data);
  }).catch(e => {
    const data = {
      result: {
        message: 'Inserted failed'
      }
    };
    return res.render('admin', data);
  })

});


// router.post('/login', (req, res) => {
//   const admin = req.body;
//   if (process.env.ADMIN_USERNAME === admin.username && process.env.ADMIN_PWD === admin.password) {
//     req.session.auth = admin;
//     return res.redirect('/auth');
//   } else {
//     return res.render('auth', { message: `Auth Failed` })
//   }

// });



module.exports = router;