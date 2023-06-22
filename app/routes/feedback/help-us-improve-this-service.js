const {
  PUBLIC_CONTEXT_PATH,
} = require('../../config/uri');
const { getBackLinkFromQueryParameter } = require('../../utils/link-util');

module.exports = (casaApp) => {
  const feedback = (req, res) => {
    res.locals.backLink = getBackLinkFromQueryParameter(req);
    res.locals.hideBackButton = true;
    return res.render('pages/feedback/help-us-improve-this-service.njk');
  };

  casaApp.router.get(`${PUBLIC_CONTEXT_PATH}/feedback`, casaApp.csrfMiddleware, feedback);

  return feedback;
};
