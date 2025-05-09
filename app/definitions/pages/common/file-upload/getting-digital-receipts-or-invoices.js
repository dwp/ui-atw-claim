const fieldValidators = require('../../../field-validators/common/optional-validator');
const { claimTypesShortName } = require('../../../../config/claim-types');

module.exports = () => ({
  view: 'pages/common/file-upload/getting-digital-receipts-or-invoices.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.journeyType = req.casa.journeyContext.getDataForPage('__journey_type__').journeyType;
      res.locals.awardType = claimTypesShortName[res.locals.journeyType];
      next();
    },
  },
});
