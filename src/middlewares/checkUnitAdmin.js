module.exports = (req, res, next) => {
  if (req.session.unit_auth) {
    next();
  } else {
    req.session.unit_message = 'Auth Failed';
    return res.redirect('/units/auth/login');
  }
}