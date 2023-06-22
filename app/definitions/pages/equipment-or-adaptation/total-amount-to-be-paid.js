const fieldValidators = require('../../field-validators/common/optional-validator');

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/equipment-or-adaptation/total-amount-to-be-paid.njk',
  fieldValidators,
  reviewBlockView: 'pages/equipment-or-adaptation/review/employer-contribution.njk',
  hooks: {
    prerender: (req, res, next) => {
      const { totalCost } = req.casa.journeyContext.getDataForPage('equipment-or-adaptation-cost');
      res.locals.totalCost = totalCost;

      next();
    },
  },
});
