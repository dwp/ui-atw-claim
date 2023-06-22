const fieldValidators = require('../../../field-validators/common/optional-validator');

module.exports = () => ({
  view: 'pages/common/file-upload/getting-digital-receipts-or-invoices.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.journeyType = req.casa.journeyContext.getDataForPage('__journey_type__').journeyType;
      next();
    },
  },
});
