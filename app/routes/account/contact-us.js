const {
  CLAIM_ROOT_URL,
  ACCOUNT_CONTEXT_PATH,
  ACCOUNT_ROOT_URL,
  GRANT_ROOT_URL,
} = require('../../config/uri');

module.exports = (casaApp) => {
  const getPage = (req, res) => {
    res.locals.grantAwards = req.casa.journeyContext.getDataForPage('__hidden_account__').account.grantAwards;
    res.locals.claimBaseUrl = CLAIM_ROOT_URL;
    const { job } = { ...req.session.selectedJob };
    const { awardType } = { ...req.session.grantSummary };

    if (job) {
      res.locals.casa.journeyPreviousUrl = `${GRANT_ROOT_URL}/multiple-job-select`;
    } else if (awardType) {
      res.locals.casa.journeyPreviousUrl = `${GRANT_ROOT_URL}/multiple-grant-select`;
    } else {
      res.locals.casa.journeyPreviousUrl = `${ACCOUNT_ROOT_URL}/home`;
    }

    return res.render('pages/account/contact-us.njk');
  };

  casaApp.router.get(`${ACCOUNT_CONTEXT_PATH}/contact-access-to-work`, casaApp.csrfMiddleware, getPage);

  return {
    getPage,
  };
};
