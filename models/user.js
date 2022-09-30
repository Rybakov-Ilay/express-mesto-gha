const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { UnauthorizedError } = require('../erorrs/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default:
      'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

userSchema.statics.findUserByCredentials = function (email, password) { // eslint-disable-line
  return this.findOne({ email }).select('+password').then((user) => { // eslint-disable-line
    if (!user) {
      throw new UnauthorizedError('Неправильные почта или пароль');
    }

    return bcrypt.compare(password, user.password).then((matched) => {
      if (!matched) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);
