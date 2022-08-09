const Card = require('../models/card');

const {
  ERROR_CODE,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
  ERROR_CODE_MESSAGE,
  ERROR_NOT_FOUND_MESSAGE,
  ERROR_DEFAULT_MESSAGE,
} = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(ERROR_DEFAULT).send(ERROR_DEFAULT_MESSAGE)); // eslint-disable-line
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      err.name === 'ValidationError' // eslint-disable-line
        ? res.status(ERROR_CODE).send(ERROR_CODE_MESSAGE)
        : res.status(ERROR_DEFAULT).send(ERROR_DEFAULT_MESSAGE);
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      !card // eslint-disable-line
        ? res.status(ERROR_NOT_FOUND).send(ERROR_NOT_FOUND_MESSAGE)
        : res.send({ data: card });
    })
    .catch((err) => {
      err.name === 'CastError' // eslint-disable-line
        ? res.status(ERROR_CODE).send(ERROR_CODE_MESSAGE)
        : res.status(ERROR_DEFAULT).send(ERROR_DEFAULT_MESSAGE);
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      !card // eslint-disable-line
        ? res.status(ERROR_NOT_FOUND).send(ERROR_NOT_FOUND_MESSAGE)
        : res.send({ data: card });
    })
    .catch((err) => {
      err.name === 'CastError' // eslint-disable-line
        ? res.status(ERROR_CODE).send(ERROR_CODE_MESSAGE)
        : res.status(ERROR_DEFAULT).send(ERROR_DEFAULT_MESSAGE);
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      !card // eslint-disable-line
        ? res.status(ERROR_NOT_FOUND).send(ERROR_NOT_FOUND_MESSAGE)
        : res.send({ data: card });
    })
    .catch((err) => {
      err.name === 'CastError' // eslint-disable-line
        ? res.status(ERROR_CODE).send(ERROR_CODE_MESSAGE)
        : res.status(ERROR_DEFAULT).send(ERROR_DEFAULT_MESSAGE);
    });
};
