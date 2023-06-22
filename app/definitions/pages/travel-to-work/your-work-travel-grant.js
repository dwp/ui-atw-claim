const fieldValidators = require('../../field-validators/common/optional-validator');
const { claimTypesFullName } = require('../../../config/claim-types');
const { CLAIM_ROOT_URL } = require('../../../config/uri');

module.exports = () => ({
  view: 'pages/travel-to-work/your-work-travel-grant.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const { skipClaimPage } = req.session;
      if (skipClaimPage) {
        res.locals.casa.journeyPreviousUrl = `${CLAIM_ROOT_URL}/select-support-to-claim`;
      }
      req.casa.journeyContext.setDataForPage(
        '__journey_type__',
        { journeyType: claimTypesFullName.TW },
      );
      res.locals.grant = req.casa.journeyContext.getDataForPage(
        '__grant_being_claimed__',
      );
      next();
    },
  },
});
