const fieldValidators = require('../../field-validators/common/optional-validator');

module.exports = () => ({
  view: 'pages/account/claim-by-post.njk',
  fieldValidators,
});
