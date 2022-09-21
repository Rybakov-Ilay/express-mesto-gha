// GET /users — возвращает всех пользователей
// GET /users/:userId - возвращает пользователя по _id
// POST /users — создаёт пользователя
// PATCH /users/me — обновляет профиль
// PATCH /users/me/avatar — обновляет аватар

const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateAvatar,
  updateProfile,
  getCurrentUser,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get(
  '/users/:userId',
  getUser,
);
router.patch(
  '/users/me',
  updateProfile,
);
router.patch(
  '/users/me/avatar',
  updateAvatar,
);

module.exports = router;
