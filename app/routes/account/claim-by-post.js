const {
  ACCOUNT_CONTEXT_PATH,
} = require('../../config/uri');

module.exports = (casaApp) => {
  const getPage = (req, res) => res.render('pages/account/claim-by-post.njk');

  casaApp.router.get(`${ACCOUNT_CONTEXT_PATH}/claim-by-post`, casaApp.csrfMiddleware, getPage);

  return {
    getPage,
  };
};
