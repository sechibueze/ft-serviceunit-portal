const express = require('express');

const Model = require('../models/model');
const sortObjArray = require('../helpers/sortObjArray');

const Member = new Model('members');
const Unit = new Model('units');
const router = express.Router();





router.get('/', (req, res) => {
  let output = {
    result: {
      query: req.query,
      admin: req.session.auth
    }
  }
  if (req.query.unit_list) {
    Unit.select('*').then(({ rows }) => {
      output.result.data = sortObjArray(rows, 'unit');
      console.log('data', rows[0])
      return res.render('admin', output);
    }).catch(e => {
      res.redirect('/admin');
    })
  } else if (req.query.members) {
    Member.select('*').then(({ rows }) => {
      output.result.data = sortObjArray(rows, 'unit');

      return res.render('admin', output);
    }).catch(e => {
      res.redirect('/admin');
    })
  } else {

    return res.render('admin', output);
  }

});

router.get('/units/:unit_id/delete', (req, res) => {
  Unit.delete(`WHERE unit_id = '${req.params.unit_id}'`).then(result => {
    res.redirect('/admin');
  }).catch(e => {
    res.redirect('/admin');
  })
});

router.get('/members/:otp/delete', (req, res) => {
  Member.delete(`WHERE otp = '${req.params.otp}'`).then(result => {
    res.redirect('/admin');
  }).catch(e => {
    res.redirect('/admin');
  })
});

router.post('/', (req, res) => {

  // console.log(req.body);
  const text = `INSERT INTO units (unit_id, unit) VALUES ($1, $2)`;
  const values = [
    req.body.unit_id,
    req.body.unit
  ];
  Unit.insertQuery(text, values).then(({ rows }) => {
    // console.log('rows : ', rows)
    const data = {
      result: {
        query: req.query,
        message: 'Inserted successfully',
        admin: req.session.auth,
        data: rows[0]
      }
    };
    return res.render('admin', data);
  }).catch(e => {
    const data = {
      result: {
        admin: req.session.auth,
        message: 'Inserted failed'
      }
    };
    return res.render('admin', data);
  })

});

router.post('/data_reset', (req, res) => {
  const { data_to_reset } = req.body;
  if (data_to_reset == 'members') {
    Member.delete().then(result => {
      res.redirect('/admin');
    }).catch(e => {
      res.redirect('/admin');
    });
  } else if (data_to_reset == 'units') {
    Unit.delete().then(result => {
      res.redirect('/admin');
    }).catch(e => {
      res.redirect('/admin');
    });
  } else {
    res.redirect('/admin');
  }

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