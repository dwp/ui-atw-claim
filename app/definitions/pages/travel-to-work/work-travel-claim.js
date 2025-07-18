const fieldValidators = require('../../field-validators/travel-to-work/work-travel-claim');
const { claimTypesFullName } = require('../../../config/claim-types');
const {
  ACCOUNT_ROOT_URL,
} = require('../../../config/uri');

module.exports = () => ({
  view: 'pages/travel-to-work/work-travel-claim.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.hideBackButton = true;
      req.casa.journeyContext.setDataForPage('__journey_type__', { journeyType: claimTypesFullName.TW });
      next();
    },
    postvalidate: (req, res, next) => {
      if(req.body.claimingTravelToWork === 'no') {
        return res.redirect(`${ACCOUNT_ROOT_URL}/multiple-claims-exit`);
      }

      next();
    },
  },
});
