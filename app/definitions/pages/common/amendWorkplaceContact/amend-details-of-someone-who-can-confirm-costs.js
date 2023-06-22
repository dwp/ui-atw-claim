const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../../field-validators/common/workplaceContact/details-of-someone-who-can-confirm-costs');

module.exports = () => ({
  view: 'pages/common/amendWorkplaceContact/amend-details-of-someone-who-can-confirm-costs.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      req.casa.journeyContext.setDataForPage('__journey_type__', { journeyType: req.session.claimHistory?.awardType });
      JourneyContext.putContext(req.session, req.casa.journeyContext);

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        res.locals.journeyType = req.casa.journeyContext.getDataForPage('__journey_type__')?.journeyType;

        next();
      });
    },
  },
});
