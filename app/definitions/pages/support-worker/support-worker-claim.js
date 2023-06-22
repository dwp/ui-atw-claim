const fieldValidators = require('../../field-validators/support-worker/support-worker-claim');
const { claimTypesFullName } = require('../../../config/claim-types');

module.exports = () => ({
  view: 'pages/support-worker/support-worker-claim.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.hideBackButton = true;
      req.casa.journeyContext.setDataForPage(
        '__journey_type__',
        { journeyType: claimTypesFullName.SW },
      );
      next();
    },
  },
});
