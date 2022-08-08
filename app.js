const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const userID = require('./utils/userID');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(userID);
app.use(usersRouter);
app.use(cardsRouter);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`); // eslint-disable-line
  });
}

main();
