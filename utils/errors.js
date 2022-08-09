const ERROR_CODE = 400;
const ERROR_NOT_FOUND = 404;
const ERROR_DEFAULT = 500;

const ERROR_CODE_MESSAGE = { message: 'Переданы некорректные данные.' };
const ERROR_NOT_FOUND_MESSAGE = { message: 'Запрашиваемый id не найден.' };
const ERROR_DEFAULT_MESSAGE = { message: `Произошла ошибка` }; // eslint-disable-line

module.exports = {
  ERROR_CODE,
  ERROR_NOT_FOUND,
  ERROR_DEFAULT,
  ERROR_CODE_MESSAGE,
  ERROR_NOT_FOUND_MESSAGE,
  ERROR_DEFAULT_MESSAGE,
};
