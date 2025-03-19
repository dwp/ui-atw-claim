const fieldValidators = require('../../field-validators/common/optional-validator');

module.exports = () => ({
  view: 'pages/travel-to-work/claiming-instructions.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.howDidYouTravelForWork = req.casa.journeyContext.getDataForPage('which-journey-type').howDidYouTravelForWork;
      next();
    },
  },
});