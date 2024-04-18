/* eslint-disable no-console */
const fieldValidators = require('../../field-validators/common/workplaceContact/employment-status');

module.exports = () => ({
  view: 'pages/travel-to-work/employment-status.njk',
  reviewBlockView: 'pages/common/workplaceContact/review/employment-status.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.journeyType = req.casa.journeyContext.getDataForPage('__journey_type__')?.journeyType;
      res.locals.howDidYouTravelForWork = req.casa.journeyContext.getDataForPage('which-journey-type').howDidYouTravelForWork;
      next();
    },
    postvalidate: (req, res, next) => {
      if (req.casa.journeyContext.getDataForPage('employment-status').employmentStatus === 'selfEmployed') {
        req.casa.journeyContext.setDataForPage('confirmer-details', undefined);
        req.casa.journeyContext.setDataForPage('check-confirmer-details', undefined);
      }
      next();
    },
  },
});
