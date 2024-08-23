const {
  ACCOUNT_CONTEXT_PATH
} = require('../../config/uri');

module.exports = (casaApp) => {
  const getPage = (req, res) => {
    req.session.noAwards = true;
    return res.render('pages/account/no-awards.njk');
  };

  casaApp.router.get(`${ACCOUNT_CONTEXT_PATH}/no-awards`, casaApp.csrfMiddleware, getPage);

  return {
    getPage,
  };
};
