const jwt = require('jsonwebtoken');
const jwtSecret = require('./keys').jwtSecret;

module.exports = (req, res, next) => {
  try {
    const authHead = req.headers.authorization;
    let token;
    if (authHead.includes('Bearer')) {
      token = authHead.split(' ')[1];
    } else {
      token = authHead;
    }

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    // Add user from payload
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    if (e.message.includes('expired')) {
      res
        .status(401)
        .json({ success: false, message: 'Your session has expired' });
    } else {
      res
        .status(401)
        .json({ success: false, message: 'You are not authorized' });
    }
  }
};
