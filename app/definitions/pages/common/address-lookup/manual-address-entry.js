const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const { trimPostalAddressObject } = require('@dwp/govuk-casa').gatherModifiers;

module.exports = (view, fieldValidators, manualWP, hiddenWP, addPayeeName) => ({
  view,
  fieldGatherModifiers: {
    address: trimPostalAddressObject,
  },
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      if (addPayeeName) {
        res.locals.payeeName = req.casa.journeyContext.getDataForPage('person-company-being-paid-details').fullName;
      }

      next();
    },
    postvalidate: (req, res, next) => {
      req.casa.journeyContext.setDataForPage(hiddenWP, {
        addressDetails: req.casa.journeyContext.getDataForPage(manualWP).address,
        addressFrom: 'manual',
      });
      JourneyContext.putContext(req.session, req.casa.journeyContext);

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        return next();
      });
    },
  },
});
