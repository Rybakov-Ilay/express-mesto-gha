const Card = require('../models/card');

const { BadRequestError } = require('../erorrs/BadRequestError');
const { NotFoundError } = require('../erorrs/NotFoundError');
const { ForbiddenError } = require('../erorrs/ForbiddenError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next); // eslint-disable-line
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      err.name === 'ValidationError' // eslint-disable-line
        ? next(new BadRequestError('Переданы некорректные данные'))
        : next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId).then((card) => { // eslint-disable-line
    if (!card) {
      // eslint-disable-line
      return next(new NotFoundError('Карточка по указанному _id не найдена'));
    }
    if (req.user._id === card.owner._id.toString()) {
      Card.findByIdAndRemove(card._id.toString())
        .then((card) => res.send({ card })) // eslint-disable-line
        .catch((err) => {
          err.name === 'CastError' // eslint-disable-line
            ? next(new BadRequestError('Переданы некорректные данные'))
            : next(err);
        });
    } else {
      next(new ForbiddenError('Нельзя удалить не свою карточку'));
    }
  })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      !card // eslint-disable-line
        ? next(new NotFoundError('Карточка по указанному _id не найдена'))
        : res.send({ data: card });
    })
    .catch((err) => {
      err.name === 'CastError' // eslint-disable-line
        ? next(new BadRequestError('Переданы некорректные данные'))
        : next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      !card // eslint-disable-line
        ? next(new NotFoundError('Карточка по указанному _id не найдена'))
        : res.send({ data: card });
    })
    .catch((err) => {
      err.name === 'CastError' // eslint-disable-line
        ? next(new BadRequestError('Переданы некорректные данные'))
        : next(err);
    });
};
