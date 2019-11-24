const express = require('express');
const otpg = require('otp-generator');
const format = require('pg-format');


const Model = require('../models/model');
const changeCase = require('../helpers/changeCase');
const checkUnitAdmin = require('../middlewares/checkUnitAdmin');
const Member = new Model('members');
const Unit = new Model('units');
const router = express.Router();



router.get('/:unit', (req, res) => {
  Unit.select('unit_id, unit', `WHERE unit_id = '${req.params.unit}'`)
    .then(({ rows }) => {
      if (rows.length > 0) {
        const data = {
          result: {
            posturl: `/units/${req.params.unit}`,
            unit: rows[0].unit.toUpperCase()

          }
        }
        return res.render('register', data);
      } else {
        return res.redirect('/');
      }


    }).catch(e => {
      res.redirect('/');
    });


});

router.post('/:unit', (req, res) => {
  // Get required fields
  let records = req.body;
  // Turn values to Uppercase
  const member = changeCase(records, ['firstname', 'surname']);
  // console.log('members : ', member);

  // Generate OTP - One Time Password
  const otp = otpg.generate(6, { uppercase: false, specialChars: false });
  // Retrieve all member variables
  const { unit_id, firstname, surname, phone, gender, availability, station } = member;

  // Build SQL Query
  const text = `INSERT INTO members (
    unit_id, firstname, surname,
    phone, unit, gender, 
    availability, station, otp) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING surname, unit_id, otp, phone`;



  const values = [
    unit_id, firstname, surname,
    phone, req.params.unit, gender, availability,
    station, otp
  ];

  // const pgSQL = format('INSERT INTO members (unit_id, firstname, surname, phone, unit, gender, availability, accomodation, otp) VALUES (%L) RETURNING surname, otp, phone, unit_id', values);
  // console.log('textQuery: ', values)
  Member.insertQuery(text, values)
    .then(({ rows }) => {

      const text = `
      IHD!
      Dear ${surname}-${unit_id}, 
      Thank you for registering to serve at Shiloh 2019. Please, take note of your OTP for future reference.
      Your OTP is: ${otp};
      `;
      const data = {
        result: {
          message: text,
          status: 'success'
        }
      }

      res.render("message", data);

    })
    .catch(e => {

      const data = {
        result: {
          message: `Unprocessed: You may have registered, please confirm`,
          status: 'Attention !!!'
        }
      }
      return res.render('message', data);

    });
});


// Unit Admins
router.get('/auth/login', (req, res) => {

  const data = {
    result: {
      message: req.session.unit_message,
    }
  }

  return res.render('unit_login', data);

});

router.post('/auth/login', (req, res) => {
  // Get required fields
  console.log('body: ', req.body)
  let clause = `WHERE unit_username='${req.body.unit_username}' AND unit_password='${req.body.unit_password}'`;
  Unit.select('unit_id, unit, unit_username, unit_password', clause)
    .then(({ rows }) => {
      if (rows.length === 1) {
        req.session.unit_auth = rows[0];

        
        return res.redirect('/units/admin/dashboard');
      } else {
        req.session.unit_message = 'Admin Not Found';
        return res.redirect('/units/auth/login');
      }
    })
    .catch(e => {
      req.session.unit_message = 'OAuth Failed';
      return res.redirect('/units/auth/login');
    });

});

router.get('/admin/dashboard', checkUnitAdmin, (req, res) => {
  let data = {
    result: {
      query: req.query,
      param: req.session.unit_id,
      message: '',
      admin: req.session.unit_auth,
      data: []
    }
  }

  if ((req.query.unit_id == req.session.unit_auth.unit_id) && req.query.unit_members) {
    console.log('request Query: ', req.query)
    Member.select('*', `WHERE unit = '${req.session.unit_auth.unit_id}'`)
      .then(({ rows }) => {
        if (rows.length > 0) {
          data.result.data = rows;

          return res.render('unit_admin', data)
        } else {
          data.result.message = 'No Member yet';

          return res.render('unit_admin', data)
        }
      }).catch(e => {
        data.result.message = 'cannot get members';

        return res.render('unit_admin', data)
      })
  } else {

    return res.render('unit_admin', data)
  }


});
router.get('/admin/dashboard/logout', (req, res) => {
  req.session.unit_auth = null;
  return res.redirect('/units/auth/login')
});



module.exports = router;