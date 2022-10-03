require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const defaultErrorHandler = require('./erorrs/DefaultErorr');
const { NotFoundError } = require('./erorrs/NotFoundError');
const { REG_EXP_LINK } = require('./utils/reg-exp');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri().regex(REG_EXP_LINK),
    }),
  }),
  createUser,
);
app.use(auth);

app.use(usersRouter);
app.use(cardsRouter);

app.use((req, res, next) => next(new NotFoundError('По данному пути ничего нет')));
app.use(errors());
app.use(defaultErrorHandler);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`); // eslint-disable-line
  });
}

main();
