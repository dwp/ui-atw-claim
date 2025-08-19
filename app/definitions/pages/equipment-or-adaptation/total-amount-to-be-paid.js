const fieldValidators = require('../../field-validators/common/optional-validator');

 
module.exports = () => ({
  view: 'pages/equipment-or-adaptation/total-amount-to-be-paid.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const { totalCost } = req.casa.journeyContext.getDataForPage('specialist-equipment-cost');
      res.locals.totalCost = totalCost;

      next();
    },
  },
});
