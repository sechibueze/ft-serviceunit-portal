const express = require('express');
const otpg = require('otp-generator');
const format = require('pg-format');


const Model = require('../models/model');
const changeCase = require('../helpers/changeCase');

const Member = new Model('members');
const Unit = new Model('units');
const router = express.Router();



router.get('/:unit', (req, res) => {
  const data = {
    result: {
      posturl: `/units/${req.params.unit}`,
      unit: req.params.unit.toUpperCase()

    }
  }
  return res.render('register', data);
  
  
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
  const { unit_id, firstname, surname, phone, gender, availability, accomodation } = member;

  // Build SQL Query
  const text = `INSERT INTO members (
    unit_id, firstname, surname,
    phone, unit, gender, 
    availability, accomodation, otp) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING surname, unit_id, otp, phone`;



  const values = [
    unit_id, firstname, surname,
    phone, req.params.unit, gender, availability,
    accomodation, otp
  ];

  // const pgSQL = format('INSERT INTO members (unit_id, firstname, surname, phone, unit, gender, availability, accomodation, otp) VALUES (%L) RETURNING surname, otp, phone, unit_id', values);
  // console.log('textQuery: ', values)
  Member.insertQuery(text, values)
    .then(({ rows }) => {

      const text = `
      IHD!
      Dear ${surname}-${unit_id}, 
      Your OTP is: ${otp};
      Kindly come to FA Multi-purpose hall for Shiloh 2019 Accreditation
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

      return res.render('error',
        { message: `Unprocessed: You may have registered, please confirm` });
    });

});




module.exports = router;