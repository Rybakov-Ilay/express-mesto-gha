const User = require('../models/user');

const {
  ERROR_CODE,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
  ERROR_CODE_MESSAGE,
  ERROR_NOT_FOUND_MESSAGE,
  ERROR_DEFAULT_MESSAGE,
} = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(ERROR_DEFAULT).send(ERROR_DEFAULT_MESSAGE));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      !user // eslint-disable-line
        ? res.status(ERROR_NOT_FOUND).send(ERROR_NOT_FOUND_MESSAGE)
        : res.send({ data: user });
    })
    .catch((err) => {
      err.name === 'CastError' // eslint-disable-line
        ? res.status(ERROR_CODE).send(ERROR_CODE_MESSAGE)
        : res.status(ERROR_DEFAULT).send(ERROR_DEFAULT_MESSAGE);
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      err.name === 'ValidationError' // eslint-disable-line
        ? res.status(ERROR_CODE).send(ERROR_CODE_MESSAGE)
        : res.status(ERROR_DEFAULT).send(ERROR_DEFAULT_MESSAGE);
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  const id = req.user._id;

  User.findOneAndUpdate(
    { _id: id },
    { name: name, about: about }, // eslint-disable-line
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      err.name === 'ValidationError' // eslint-disable-line
        ? res.status(ERROR_CODE).send(ERROR_CODE_MESSAGE)
        : res.status(ERROR_DEFAULT).send(ERROR_DEFAULT_MESSAGE);
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const id = req.user._id;

  User.findOneAndUpdate(
    { _id: id },
    { avatar: avatar }, // eslint-disable-line
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      err.name === 'ValidationError' // eslint-disable-line
        ? res.status(ERROR_CODE).send(ERROR_CODE_MESSAGE)
        : res.status(ERROR_DEFAULT).send(ERROR_DEFAULT_MESSAGE);
    });
};
