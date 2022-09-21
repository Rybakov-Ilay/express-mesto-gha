require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const defaultErrorHandler = require('./erorrs/DefaultErorr');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post(
  '/signin',
  login,
);
app.post(
  '/signup',
  createUser,
);
app.use(auth);

app.use(usersRouter);
app.use(cardsRouter);
app.patch('*', (req, res) => {
  res.status(404).send({ message: 'По данному пути нет ничего' });
});
app.use(defaultErrorHandler);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`); // eslint-disable-line
  });
}

main();
