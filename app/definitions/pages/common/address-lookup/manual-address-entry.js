const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const { trimPostalAddressObject } = require('@dwp/govuk-casa').gatherModifiers;
const { claimTypesShortName } = require('../../../../config/claim-types');

module.exports = (view, fieldValidators, manualWP, hiddenWP, addPayeeName) => ({
  view,
  fieldGatherModifiers: {
    address: trimPostalAddressObject,
  },
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.forceShowBackButton = true;

      if (req.casa.journeyContext.getDataForPage('__journey_type__')) {
        const { journeyType } = req.casa.journeyContext.getDataForPage('__journey_type__');
        res.locals.journeyType = journeyType;
        res.locals.awardType = claimTypesShortName[res.locals.journeyType];
      }

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
