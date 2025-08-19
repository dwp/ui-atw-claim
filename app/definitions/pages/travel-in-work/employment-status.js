 
const fieldValidators = require('../../field-validators/common/workplaceContact/employment-status');

module.exports = () => ({
  view: 'pages/travel-in-work/employment-status.njk',
  reviewBlockView: 'pages/common/workplaceContact/review/employment-status.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.journeyType = req.casa.journeyContext.getDataForPage('__journey_type__')?.journeyType;
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
