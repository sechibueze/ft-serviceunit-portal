const Model = require('../models/model');
const Unit = new Model('units');
module.exports = (req, res) => {
  Unit.select('*').then(({ rows }) => {
    const data = {
      result: {
        data: rows
      }
    }
    return res.render('index', data);
  }).catch(e => {
    const data = {
      result: {

        message: 'No List yet'
      }
    }
    return res.render('index', data);
  })
}