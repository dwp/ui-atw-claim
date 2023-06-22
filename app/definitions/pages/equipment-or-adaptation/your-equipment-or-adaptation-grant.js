const fieldValidators = require('../../field-validators/common/optional-validator');
const {
  CLAIM_ROOT_URL,
} = require('../../../config/uri');
const { claimTypesFullName } = require('../../../config/claim-types');

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/equipment-or-adaptation/your-equipment-or-adaptation-grant.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const { skipClaimPage } = req.session;
      if (skipClaimPage) {
        res.locals.casa.journeyPreviousUrl = `${CLAIM_ROOT_URL}/select-support-to-claim`;
      }
      req.casa.journeyContext.setDataForPage(
        '__journey_type__',
        { journeyType: claimTypesFullName.EA },
      );
      res.locals.grant = req.casa.journeyContext.getDataForPage('__grant_being_claimed__');
      next();
    },
  },
});
