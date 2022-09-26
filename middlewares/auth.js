const { JWT_SECRET = 'dev-secret' } = process.env;
const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../erorrs/UnauthorizedError');

module.exports = (req, res, next) => {
  // eslint-disable-line
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
