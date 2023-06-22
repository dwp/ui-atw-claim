const {
    PUBLIC_CONTEXT_PATH,
  } = require('../../config/uri');
  const { getBackLinkFromQueryParameter } = require('../../utils/link-util');
  
  module.exports = (casaApp) => {
    const accessibilityStatement = (req, res) => {
      res.locals.backLink = getBackLinkFromQueryParameter(req);
      res.locals.hideBackButton = true;
      return res.render('pages/common/accessibility-statement.njk');
    };
  
    casaApp.router.get(`${PUBLIC_CONTEXT_PATH}/accessibility-statement`, casaApp.csrfMiddleware, accessibilityStatement);
  
    return accessibilityStatement;
  };
  