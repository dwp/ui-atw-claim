const fieldValidators = require('../../field-validators/support-worker/support-cost');
const { removeAllSpaces } = require('../../../utils/remove-all-spaces');

module.exports = () => ({
  view: 'pages/support-worker/support-cost.njk',
  fieldValidators,
  hooks: {
    pregather: (req, res, next) => {
      req.body.totalCost = removeAllSpaces(req.body.totalCost);
      req.body.totalCost = Number.parseFloat(req.body.totalCost).toFixed(2);
      next();
    },
  },
});
