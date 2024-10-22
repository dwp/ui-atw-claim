const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/travel-to-work/journey-summary');
const logger = require('../../../logger/logger');
const { stashStateForPage, restoreStateForPage } = require('../../../utils/stash-util');
const { claimTypesShortName } = require('../../../config/claim-types');
const { getChangeLinkCalculatorMonthChange } = require('../../../utils/link-util');

const { calculateChangeLinkUrl } = getChangeLinkCalculatorMonthChange(claimTypesShortName.TRAVEL_TO_WORK);

const log = logger('travel-to-work:journey-summary');

const hasUserWantedToAddAnotherMonth = (req) => req.casa.journeyContext.getDataForPage('journey-summary')?.anotherMonth === 'yes';

const stashStateBeforeAdditionOfNewMonth = (req) => {
  stashStateForPage(req, 'travel-month');
};

const restoreStateToBeforeUnsuccessfullAdditionOfNewMonth = (req) => {
  restoreStateForPage(req, 'travel-month');
};

module.exports = () => ({
  view: 'pages/travel-to-work/journey-summary.njk',
  fieldValidators,
  reviewBlockView: 'pages/travel-to-work/review/travel-to-work-claim-information.njk',
  hooks: {
    prerender: (req, res, next) => {
      res.locals.hideBackButton = true;
      if (hasUserWantedToAddAnotherMonth(req)) {
        req.casa.journeyContext.setDataForPage('journey-summary', undefined);
        restoreStateToBeforeUnsuccessfullAdditionOfNewMonth(req);
      }
      res.locals.howDidYouTravelForWork = req.casa.journeyContext.getDataForPage('which-journey-type').howDidYouTravelForWork;
      // Clear any data so if user used back button from the remove screen this data is cleared
      req.casa.journeyContext.setDataForPage('remove-travel-month', undefined);
      res.locals.journeysOrMileage = req.casa.journeyContext.getDataForPage('journeys-miles')?.journeysOrMileage;

      const allData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
      res.locals.allData = allData;

      let blankArray = [];

      Object.keys(allData)
          .forEach((key) => {
            const index = parseInt(key, 10);
            const item = allData[index];

            Object.keys(item.claim)
                .forEach((key) => {
                  const index = parseInt(key, 10);
                  const items = item.claim[index];

                  blankArray.push(parseFloat(items.totalTravel));

                });
          });

      const totalJourneys = blankArray.reduce((a, cv) => { return a + parseFloat(cv)}, 0);
      res.locals.totalJourneys = totalJourneys;

      res.locals.monthYear = req.casa.journeyContext.getDataForPage('travel-month').dateOfTravel;

      res.locals.calculateChangeLinkUrl = calculateChangeLinkUrl;
      next();
    },
    prevalidate: (req, res, next) => {
      if (req.body.remove !== undefined) {
        log.debug('Remove but clicked');

        req.casa.journeyContext.setDataForPage('remove-travel-month', {
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

        req.casa.journeyContext.setDataForPage('travel-days', undefined);
        stashStateBeforeAdditionOfNewMonth(req);
        req.casa.journeyContext.setDataForPage('travel-month', {
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
