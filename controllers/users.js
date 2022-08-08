const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(404)
          .send({ message: 'Запрашиваемый пользователь не найден.' });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные ' });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
      }
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
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные ' });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
      }
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
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные ' });
      } else {
        res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
      }
    });
};
