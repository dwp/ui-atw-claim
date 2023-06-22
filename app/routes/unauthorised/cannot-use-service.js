const {
  PUBLIC_CONTEXT_PATH,
} = require('../../config/uri');

module.exports = (casaApp) => {
  const cannotUseService = (req, res) => res.render('pages/unauthorised/cannot-use-service.njk');

  casaApp.router.get(`${PUBLIC_CONTEXT_PATH}/cannot-use-service`, casaApp.csrfMiddleware, cannotUseService);

  return cannotUseService;
};
