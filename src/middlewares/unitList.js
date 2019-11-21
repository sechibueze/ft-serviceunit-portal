const Model = require('../models/model');
const sortArrayOfObjs = require('../helpers/sortObjArray');
const Unit = new Model('units');
module.exports = (req, res) => {
  Unit.select('*').then(({ rows }) => {
    const records = sortArrayOfObjs(rows, 'unit');
    const data = {
      result: {
        data: records
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