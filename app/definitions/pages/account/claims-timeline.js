const fieldValidators = require('../../field-validators/common/optional-validator');

module.exports = () => ({
  view: 'pages/account/claims-timeline.njk',
  fieldValidators,
});
