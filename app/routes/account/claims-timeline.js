const {
  ACCOUNT_CONTEXT_PATH,
} = require('../../config/uri');

module.exports = (casaApp) => {
  const claimsTimeline = (req, res) => {
    const { awardType } = req.session.claimHistory;

    res.locals.awardType = awardType;

    return res.render('pages/account/claims-timeline.njk');
  };

  casaApp.router.get(`${ACCOUNT_CONTEXT_PATH}/claims-timeline`, casaApp.csrfMiddleware, claimsTimeline);

  return { claimsTimeline };
};
