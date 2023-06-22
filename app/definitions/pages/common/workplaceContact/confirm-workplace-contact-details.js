const fieldValidators = require('../../../field-validators/common/required-validator');

module.exports = () => ({
  view: 'pages/common/workplaceContact/confirm-workplace-contact-details.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.BUTTON_TEXT = res.locals.t('confirm-workplace-contact-details:continueButton');
      res.locals.fullName = req.casa.journeyContext.getDataForPage('details-of-someone-who-can-confirm-costs').fullName;
      res.locals.emailAddress = req.casa.journeyContext.getDataForPage('details-of-someone-who-can-confirm-costs').emailAddress;
      res.locals.journeyType = req.casa.journeyContext.getDataForPage('__journey_type__')?.journeyType;
      next();
    },
  },
});
