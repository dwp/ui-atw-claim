const fieldValidators = require('../../field-validators/common/optional-validator');

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/equipment-or-adaptation/equipment-or-adaptation-summary.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.hideBackButton = true;
      res.locals.pData = req.casa.journeyContext.getDataForPage('your-specialist-equipment');
      next();
    },
  },
});
