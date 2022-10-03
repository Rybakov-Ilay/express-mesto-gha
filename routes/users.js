// GET /users — возвращает всех пользователей
// GET /users/:userId - возвращает пользователя по _id
// POST /users — создаёт пользователя
// PATCH /users/me — обновляет профиль
// PATCH /users/me/avatar — обновляет аватар

const { celebrate, Joi } = require('celebrate');

const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateAvatar,
  updateProfile,
  getCurrentUser,
} = require('../controllers/users');
const { REG_EXP_LINK } = require('../utils/reg-exp');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get(
  '/users/:userId',
  celebrate({
    params: Joi.object().keys({ userId: Joi.string().alphanum().length(24) }),
  }),
  getUser,
);
router.patch(
  '/users/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  updateProfile,
);
router.patch(
  '/users/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri().required().regex(REG_EXP_LINK),
    }),
  }),
  updateAvatar,
);

module.exports = router;
