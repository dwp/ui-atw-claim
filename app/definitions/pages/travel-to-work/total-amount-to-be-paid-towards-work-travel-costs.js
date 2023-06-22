const fieldValidators = require('../../field-validators/common/optional-validator');

module.exports = () => ({
  view: 'pages/travel-to-work/total-amount-to-be-paid-towards-work-travel-costs.njk',
  fieldValidators,
  hooks: {
    prerender(req, res, next) {
      res.locals.totalCost = req.casa.journeyContext.getDataForPage('cost-of-taxi-journeys').totalCost;
      next();
    },
  },
});
