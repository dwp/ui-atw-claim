const fieldValidators = require('../../field-validators/common/optional-validator');

module.exports = () => ({
  view: 'pages/vehicle-adaptations/total-vehicle-adaptations-cost.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const { totalCost } = req.casa.journeyContext.getDataForPage('vehicle-adaptations-cost');
      res.locals.totalCost = totalCost;

      next();
    },
  },
});
