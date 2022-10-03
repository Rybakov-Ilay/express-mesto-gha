require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');

const routes = require('./routes/index');
const defaultErrorHandler = require('./erorrs/DefaultErorr');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(routes);
app.use(errors());
app.use(defaultErrorHandler);

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`); // eslint-disable-line
  });
}

main();
