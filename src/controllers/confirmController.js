const express = require('express');
const Model = require('../models/model');
const Member = new Model('members');
const router = express.Router();

router.get('/', (req, res) => {
  const output = {
    result: {
      data: [],
      message: ''
    }
  };
  return res.render('confirm', output);
});
router.post('/', (req, res) => {
  const output = {
    result: {
      data: [],
      message: ''
    }
  };

  // return console.log(req.body)
  const { unit_id } = req.body;

  const clause = `WHERE unit_id = '${unit_id}'`;
  Member.select('*', clause)
    .then(({ rows }) => {
      // const data = rows;
      if (rows.length === 1) {
        output.result.message = "Record Found";
        output.result.data = rows;

        return res.render('confirm', output);


      } else {
        output.result.message = 'Record Not found';
        return res.render('confirm', output);
      }


    })
    .catch(e => console.log('Cannot get memebers', e));

});

module.exports = router;