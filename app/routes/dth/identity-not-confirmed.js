const {
  PUBLIC_CONTEXT_PATH,
} = require('../../config/uri');

module.exports = (casaApp) => {
  const identityNotConfirmed = (req, res) => res.render('pages/dth/identity-not-confirmed.njk');

  casaApp.router.get(`${PUBLIC_CONTEXT_PATH}/identity-not-confirmed`, casaApp.csrfMiddleware, identityNotConfirmed);

  return identityNotConfirmed;
};
