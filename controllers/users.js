const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const { NotFoundError } = require('../erorrs/NotFoundError');
const { BadRequestError } = require('../erorrs/BadRequestError');
const { ConflictError } = require('../erorrs/ConflictError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      !user // eslint-disable-line
        ? next(new NotFoundError('Пользователь по указанному _id не найден'))
        : res.send({ data: user });
    })
    .catch((err) => {
      err.name === 'CastError' // eslint-disable-line
        ? next(new BadRequestError('Переданы некорректные данные'))
        : next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body; // eslint-disable-line

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Такой email уже есть');
      } else {
        console.log(bcrypt.hash(password, 10));
        return bcrypt.hash(password, 10);
      }
    })
    .then((hash) => User.create({ name, about, avatar, email, password: hash })) // eslint-disable-line
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      err.name === 'ValidationError' // eslint-disable-line
        ? next(new BadRequestError('Переданы некорректные данные'))
        : next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user);
      const token = jwt.sign(
        { _id: user._id }, // eslint-disable-line
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({
          message: `Аутентификация прошла успешно. Ваш токен: ${token}`,
        });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findOneAndUpdate(
    { _id: id }, // eslint-disable-line
    { name: name, about: about }, // eslint-disable-line
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      err.name === 'ValidationError' // eslint-disable-line
        ? next(new BadRequestError('Переданы некорректные данные'))
        : next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findOneAndUpdate(
    { _id: id }, // eslint-disable-line
    { avatar: avatar }, // eslint-disable-line
    { new: true, runValidators: true }, // eslint-disable-line
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      err.name === 'ValidationError' // eslint-disable-line
        ? next(new BadRequestError('Переданы некорректные данные'))
        : next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .select('+password')
    .then((user) => {
      !user // eslint-disable-line
        ? next(new NotFoundError('Пользователь с указанным _id не найден'))
        : res.send({ data: user });
    })
    .catch((err) => {
      err.name === 'CastError' // eslint-disable-line
        ? next(new BadRequestError('Переданы некорректные данные'))
        : next(err);
    });
};
