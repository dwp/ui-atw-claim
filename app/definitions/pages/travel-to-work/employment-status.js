/* eslint-disable no-console */
const fieldValidators = require('../../field-validators/travel-to-work/employment-status');

module.exports = () => ({
  view: 'pages/travel-to-work/employment-status.njk',
  reviewBlockView: 'pages/common/workplaceContact/review/employment-status.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.journeyType = req.casa.journeyContext.getDataForPage('__journey_type__')?.journeyType;
      res.locals.howDidYouTravelForWork = req.casa.journeyContext.getDataForPage('how-did-you-travel-for-work').howDidYouTravelForWork;
      next();
    },
    postvalidate: (req, res, next) => {
      if (req.casa.journeyContext.getDataForPage('employment-status').employmentStatus === 'selfEmployed') {
        req.casa.journeyContext.setDataForPage('details-of-someone-who-can-confirm-costs', undefined);
        req.casa.journeyContext.setDataForPage('confirm-workplace-contact-details', undefined);
      }
      next();
    },
  },
});
