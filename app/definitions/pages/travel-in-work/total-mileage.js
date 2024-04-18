const fieldValidators = require('../../field-validators/travel-in-work/total-mileage');
const { removeAllSpaces } = require('../../../utils/remove-all-spaces');

module.exports = () => ({
  view: 'pages/travel-in-work/total-mileage.njk',
  fieldValidators,
  hooks: {
    pregather: (req, res, next) => {
      req.body.totalMileage = removeAllSpaces(req.body.totalMileage);
      next();
    },
  },
});
