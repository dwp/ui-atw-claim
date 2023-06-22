const fieldValidators = require('../../../field-validators/common/workplaceContact/details-of-someone-who-can-confirm-costs');
const removeAllSpaces = require('../../../../utils/remove-all-spaces');

module.exports = () => ({
  view: 'pages/common/workplaceContact/details-of-someone-who-can-confirm-costs.njk',
  reviewBlockView: 'pages/common/workplaceContact/review/details-of-someone-who-can-confirm-costs.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.journeyType = req.casa.journeyContext.getDataForPage('__journey_type__')?.journeyType;
      next();
    },
    pregather: (req, res, next) => {
      req.body.emailAddress = removeAllSpaces(req.body.emailAddress);
      next();
    },
  },
});
