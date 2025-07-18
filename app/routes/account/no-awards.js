const {
  ACCOUNT_CONTEXT_PATH
} = require('../../config/uri');


module.exports = (casaApp) => {
  const getPage = (req, res) => {
    req.session.noAwards = true;
    res.locals.noAwardsClaim = false;
    res.locals.noAwardsGrant = false;
    return res.render('pages/account/no-awards.njk');
  };

  const getPageGrant = (req, res) => {
    req.session.noAwards = true;
    res.locals.noAwardsClaim = false;
    res.locals.noAwardsGrant = true;
    return res.render('pages/account/no-awards.njk');
  };

  const getPageClaims = (req, res) => {
    req.session.noAwards = true;
    res.locals.noAwardsClaim = true;
    res.locals.noAwardsGrant = false;
    return res.render('pages/account/no-awards.njk');
  };

  casaApp.router.get(`${ACCOUNT_CONTEXT_PATH}/no-awards`, casaApp.csrfMiddleware, getPage);
  casaApp.router.get(`${ACCOUNT_CONTEXT_PATH}/no-award-grant-info`, casaApp.csrfMiddleware, getPageGrant);
  casaApp.router.get(`${ACCOUNT_CONTEXT_PATH}/no-award-claims`, casaApp.csrfMiddleware, getPageClaims);

  return {
    getPage,
    getPageGrant,
    getPageClaims
  };
};
