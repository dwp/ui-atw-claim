const fieldValidators = require('../../field-validators/common/optional-validator');

module.exports = () => ({
  view: 'pages/support-worker/amount-to-be-paid-towards-support.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const { totalCost } = req.casa.journeyContext.getDataForPage('support-cost');
      res.locals.totalCost = totalCost;

      next();
    },
  },
});
