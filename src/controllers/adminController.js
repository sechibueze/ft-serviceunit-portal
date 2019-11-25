const express = require('express');
const fastcsv = require("fast-csv");
const fs = require("fs");
const path = require('path');
const convertapi = require('convertapi')(process.env.CONVERTAPI_KEY);

const Model = require('../models/model');
const sortObjArray = require('../helpers/sortObjArray');

const Member = new Model('members');
const Unit = new Model('units');
const router = express.Router();





router.get('/', (req, res) => {
  let output = {
    result: {
      query: req.query,
      admin: req.session.auth,
      download_url: ''
    }
  }
  if (req.query.unit_list) {
    Unit.select('*').then(({ rows }) => {
      output.result.data = sortObjArray(rows, 'unit');

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
    });
  } else if (req.query.master_report) {
    Member.select('*').then(({ rows }) => {

      if (rows.length > 0) {
        output.result.data = sortObjArray(rows, 'unit');

        const jsonData = JSON.parse(JSON.stringify(rows));
        const ws = fs.createWriteStream(path.join(__dirname, "/master_report/master_" + Date.now() + "_members.csv"));

        fastcsv
          .write(jsonData, { headers: true })
          .on("finish", function () {
            // console.log("function ", e);
            // data.result.message = 'Available for Download';
            console.log("Write to master lis successfully!", ws.path);
            let filePath = path.resolve(ws.path).replace(/\\/g, '/');
            console.log('file Path : ', filePath);

            convertapi.convert('xlsx', {
              File: filePath
            }, 'csv').then(function (result) {
              console.log('url : ', result.file.url);
              output.result.download_url = result.file.url;
              return res.render('admin', output);
            }).catch(e => {

              output.result.message = 'Failed to generate report';
              return res.render('admin', output);
            });

          })
          .pipe(ws);
      } else {

        return res.render('admin', output);
      }


    }).catch(e => {
      res.redirect('/admin');
    });

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
  const text = `INSERT INTO units (unit_id, unit, unit_username, unit_password) VALUES ($1, $2, $3, $4) RETURNING unit_username, unit_id, unit`;
  const values = [
    req.body.unit_id,
    req.body.unit,
    req.body.unit_username,
    req.body.unit_password
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
    // return res.redirect('/admin');
  }).catch(e => {
    const data = {
      result: {
        query: req.query,
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






module.exports = router;