const express = require('express');
const otpg = require('otp-generator');
const format = require('pg-format');


const Model = require('../models/model');
const changeCase = require('../helpers/changeCase');

const Member = new Model('members');
const Unit = new Model('units');
const router = express.Router();



router.get('/:unit', (req, res) => {
  Unit.select('unit', `WHERE unit_id = '${req.params.unit}'`)
    .then(({ rows }) => {
      const data = {
        result: {
          posturl: `/units/${req.params.unit}`,
          unit: rows[0].unit.toUpperCase()

        }
      }
      return res.render('register', data);


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



module.exports = router;