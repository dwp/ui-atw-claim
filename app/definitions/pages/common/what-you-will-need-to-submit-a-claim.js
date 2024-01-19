const fieldValidators = require('../../field-validators/common/optional-validator');
const { claimTypesFullName } = require('../../../config/claim-types');

module.exports = () => ({
  view: 'pages/common/what-you-will-need-to-submit-a-claim.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const { journeyType } = req.casa.journeyContext.getDataForPage('__journey_type__');
      let page;

      if (journeyType === claimTypesFullName.EA) {
        page = 'pages/equipment-or-adaptation/what-you-will-need-to-submit-a-claim.njk';
      } else if (journeyType === claimTypesFullName.SW) {
        page = 'pages/support-worker/what-you-will-need-to-submit-a-claim.njk';
      } else if (journeyType === claimTypesFullName.TW) {
        page = 'pages/travel-to-work/what-you-will-need-to-submit-a-claim.njk';
      } else if (journeyType === claimTypesFullName.AV) {
        page = 'pages/vehicle-adaptations/what-you-will-need-to-submit-a-claim.njk';
      } else {
        throw Error(`unsupported journeyType ${journeyType}`);
      }

      res.locals.pageFile = page;
      res.locals.journeyType = journeyType;
      res.locals.BUTTON_TEXT = res.locals.t('what-you-will-need-to-submit-a-claim:common.continueButton');
      next();
    },
  },
});
