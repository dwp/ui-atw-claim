const fieldValidators = require('../../field-validators/travel-to-work/cost-of-taxi-journeys');
const { removeAllSpaces } = require('../../../utils/remove-all-spaces');

module.exports = () => ({
  view: 'pages/travel-to-work/cost-of-taxi-journeys.njk',
  fieldValidators,
  hooks: {
    pregather: (req, res, next) => {
      req.body.totalCost = removeAllSpaces(req.body.totalCost);
      req.body.totalCost = Number.parseFloat(req.body.totalCost).toFixed(2);
      next();
    },
  },
});
