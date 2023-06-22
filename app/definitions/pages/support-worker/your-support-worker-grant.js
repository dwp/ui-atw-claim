const fieldValidators = require('../../field-validators/common/optional-validator');
const {
  CLAIM_ROOT_URL,
} = require('../../../config/uri');
const { claimTypesFullName } = require('../../../config/claim-types');

module.exports = () => ({
  view: 'pages/support-worker/your-support-worker-grant.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const { skipClaimPage } = req.session;
      if (skipClaimPage) {
        res.locals.casa.journeyPreviousUrl = `${CLAIM_ROOT_URL}/select-support-to-claim`;
      }
      req.casa.journeyContext.setDataForPage(
        '__journey_type__',
        { journeyType: claimTypesFullName.SW },
      );

      res.locals.grant = req.casa.journeyContext.getDataForPage(
        '__grant_being_claimed__',
      );

      next();
    },
  },
});
