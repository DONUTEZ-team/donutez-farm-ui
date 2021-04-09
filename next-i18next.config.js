const path = require('path');

module.exports = {
  i18n: {
    locales: ['en', 'ru', 'uk', 'zh'],
    defaultLocale: 'en',
    localePath: path.resolve('./public/static/locales'),
    keySeparator: false,
  },
}