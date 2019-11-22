module.exports = (req, res, next) => {
  if (req.session.auth) {
    next();
  } else {
    return res.redirect('/auth');
  }
}