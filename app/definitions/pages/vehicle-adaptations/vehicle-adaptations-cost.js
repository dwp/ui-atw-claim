const fieldValidators = require('../../field-validators/vehicle-adaptations/vehicle-adaptations-cost');
const { removeAllSpaces } = require('../../../utils/remove-all-spaces');

module.exports = () => ({
  view: 'pages/vehicle-adaptations/vehicle-adaptations-cost.njk',
  fieldValidators,
  hooks: {
    pregather: (req, res, next) => {
      req.body.totalCost = removeAllSpaces(req.body.totalCost);
      req.body.totalCost = Number.parseFloat(req.body.totalCost).toFixed(2);
      next();
    },
  },
});
