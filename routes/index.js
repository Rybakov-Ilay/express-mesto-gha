const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
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
router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});
router.use(auth);
router.use(usersRouter);
router.use(cardsRouter);
router.use((req, res, next) => next(new NotFoundError('По данному пути ничего нет')));

module.exports = router;
