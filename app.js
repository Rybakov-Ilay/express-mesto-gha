const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = { _id: '62ef698596489b1f9f94e8ad' };

  next();
});
app.use(usersRouter);
app.use(cardsRouter);
app.patch('*', (req, res) => {
  res.status(404).send({ message: 'По данному пути нет ничего' });
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`); // eslint-disable-line
  });
}

main();
