const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/travel-to-work/journey-summary');
const logger = require('../../../logger/logger');
const { sumUnNestedAttributeForClaim } = require('../../../utils/claim-util');
const { stashStateForPage, restoreStateForPage } = require('../../../utils/stash-util');
const { claimTypesShortName } = require('../../../config/claim-types');
const { getChangeLinkCalculator } = require('../../../utils/link-util');

const { calculateChangeLinkUrl } = getChangeLinkCalculator(claimTypesShortName.TRAVEL_TO_WORK);

const log = logger('travel-to-work:journey-summary');

const calculateTotalDaysTravelledAcrossAllClaims = (allData) => sumUnNestedAttributeForClaim(allData, ['totalTravel', 'dayOfTravel'], 'totalTravel');

const hasUserWantedToAddAnotherMonth = (req) => req.casa.journeyContext.getDataForPage('journey-summary')?.anotherMonth === 'yes';

const stashStateBeforeAdditionOfNewMonth = (req) => {
  stashStateForPage(req, 'month-claiming-travel-for-work');
};

const restoreStateToBeforeUnsuccessfullAdditionOfNewMonth = (req) => {
  restoreStateForPage(req, 'month-claiming-travel-for-work');
};

module.exports = () => ({
  view: 'pages/travel-to-work/journey-summary.njk',
  fieldValidators,
  reviewBlockView: 'pages/travel-to-work/review/travel-to-work-claim-information.njk',
  hooks: {
    prerender: (req, res, next) => {
      if (hasUserWantedToAddAnotherMonth(req)) {
        req.casa.journeyContext.setDataForPage('journey-summary', undefined);
        restoreStateToBeforeUnsuccessfullAdditionOfNewMonth(req);
      }
      res.locals.howDidYouTravelForWork = req.casa.journeyContext.getDataForPage('how-did-you-travel-for-work').howDidYouTravelForWork;
      // Clear any data so if user used back button from the remove screen this data is cleared
      req.casa.journeyContext.setDataForPage('remove-month-of-travel', undefined);
      res.locals.journeysOrMileage = req.casa.journeyContext.getDataForPage('journey-or-mileage')?.journeysOrMileage;

      const allData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
      const travelTotal = calculateTotalDaysTravelledAcrossAllClaims(allData);
      res.locals.allData = allData;
      res.locals.travelTotal = travelTotal;

      res.locals.monthYear = req.casa.journeyContext.getDataForPage('month-claiming-travel-for-work').dateOfTravel;

      res.locals.calculateChangeLinkUrl = calculateChangeLinkUrl;
      next();
    },
    prevalidate: (req, res, next) => {
      if (req.body.remove !== undefined) {
        log.debug('Remove but clicked');

        req.casa.journeyContext.setDataForPage('remove-month-of-travel', {
          removeId: req.body.remove,
        });
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return next();
        });
      } else {
        next();
      }
    },
    postvalidate: (req, res, next) => {
      // If user wants to add another month clear users answers
      if (hasUserWantedToAddAnotherMonth(req)) {
        log.debug('Add another month');

        const allData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
        const keysLength = Object.keys(allData).length;
        const newMonthIndex = parseInt(Object.keys(allData)[keysLength - 1], 10) + 1;

        log.debug(`Key length ${keysLength}`);
        log.debug(`new month index length ${newMonthIndex}`);
        log.debug(allData);

        req.casa.journeyContext.setDataForPage('days-you-travelled-for-work', undefined);
        stashStateBeforeAdditionOfNewMonth(req);
        req.casa.journeyContext.setDataForPage('month-claiming-travel-for-work', {
          monthIndex: newMonthIndex.toString(),
        });
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return next();
        });
      } else {
        next();
      }
    },
  },
});
