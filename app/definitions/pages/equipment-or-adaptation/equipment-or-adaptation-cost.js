const fieldValidators = require('../../field-validators/equipment-or-adaptation/equipment-or-adaptation-cost');
const removeAllSpaces = require('../../../utils/remove-all-spaces');

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/equipment-or-adaptation/equipment-or-adaptation-cost.njk',
  fieldValidators,
  hooks: {
    pregather: (req, res, next) => {
      req.body.totalCost = removeAllSpaces(req.body.totalCost);
      next();
    },
  },
});
