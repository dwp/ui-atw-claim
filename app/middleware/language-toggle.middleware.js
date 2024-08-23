/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
const { SHOW_WELSH_LANGUAGE_TOGGLE } = require('../config/config-mapping');

module.exports = (app) => {
  const populateResLocals = (req, res, next) => {
    if(req.url === '/claim-submitted') {
      res.locals.showLanguageToggle = false;
    } else {
      if (Object.keys(req.query).length > 0) {
        let url = '?';
        for (const prop in req.query) {
          if (prop === 'lang') {
            continue;
          }
          if (url !== '?') {
            url = `${url}&`;
          }
          url = `${url + prop}=${req.query[prop]}`;
        }
        res.locals.languageUrlEn = `${url}&lang=en`;
        res.locals.languageUrlCy = `${url}&lang=cy`;
      } else {
        res.locals.languageUrlEn = '?lang=en';
        res.locals.languageUrlCy = '?lang=cy';
      }
      res.locals.showLanguageToggle = SHOW_WELSH_LANGUAGE_TOGGLE;
    }
    next();
  };
  app.use(populateResLocals);

  return { populateResLocals };
};
