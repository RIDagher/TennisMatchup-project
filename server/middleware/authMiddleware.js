const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  //const token = req.header('auth-token') || req.header('authorization');
  const bearerToken = req.header('authorization');
  const token = bearerToken && bearerToken.split(' ')[1];
  console.log('Token from request:', token);
  console.log('All request headers:', req.headers);

  if (!token) return res.status(401).send('Access Denied');

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Verified token data:', verified);
    req.user = verified;
    next();
  } catch (err) {
    console.log('Error verifying token:', err.message);
    res.status(400).send('Invalid Token');
  }
};

module.exports = verifyToken;
