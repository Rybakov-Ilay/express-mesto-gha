const router = require('express').Router();
const { login, createUser, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { NotFoundError } = require('../erorrs/NotFoundError');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const {
  validateAuthentication,
  validateUserBody,
} = require('../utils/validations');

router.post('/signin', validateUserBody, login);
router.post('/signup', validateAuthentication, createUser);
router.get('/signout', logout);
router.use(auth);
router.use(usersRouter);
router.use(cardsRouter);
router.use((req, res, next) => next(new NotFoundError('По данному пути ничего нет')));

module.exports = router;
