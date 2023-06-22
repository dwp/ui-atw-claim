const {
  CLAIM_ROOT_URL,
  ACCOUNT_CONTEXT_PATH,
} = require('../../config/uri');

module.exports = (casaApp) => {
  const getPage = (req, res) => {
    res.locals.grantAwards = req.casa.journeyContext.getDataForPage('__hidden_account__').account.grantAwards;
    res.locals.claimBaseUrl = CLAIM_ROOT_URL;
    return res.render('pages/account/contact-us.njk');
  };

  casaApp.router.get(`${ACCOUNT_CONTEXT_PATH}/contact-us`, casaApp.csrfMiddleware, getPage);

  return {
    getPage,
  };
};
