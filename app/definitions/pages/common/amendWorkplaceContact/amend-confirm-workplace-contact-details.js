const fieldValidators = require('../../../field-validators/common/required-validator');

module.exports = () => ({
  view: 'pages/common/amendWorkplaceContact/amend-confirm-workplace-contact-details.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.BUTTON_TEXT = res.locals.t('confirm-workplace-contact-details:continueButton');
      res.locals.fullName = req.casa.journeyContext.getDataForPage('amend-confirmer-details').fullName;
      res.locals.emailAddress = req.casa.journeyContext.getDataForPage('amend-confirmer-details').emailAddress;
      next();
    },
  },
});
