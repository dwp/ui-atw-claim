const fieldValidators = require('../../field-validators/travel-in-work/taxi-journeys-summary');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const { getChangeLinkCalculatorMonthChange, getRemoveLinkCalculatorMonthRemove } = require('../../../utils/link-util');
const {claimTypesShortName} = require("../../../config/claim-types");
const {stashStateForPage, restoreStateForPage} = require("../../../utils/stash-util");
const { calculateChangeLinkUrl } = getChangeLinkCalculatorMonthChange(claimTypesShortName.TRAVEL_IN_WORK);
const { calculateRemoveLinkUrl } = getRemoveLinkCalculatorMonthRemove(claimTypesShortName.TRAVEL_IN_WORK);
const hasUserWantedToAddAnotherMonth = (req) => req.casa.journeyContext.getDataForPage('taxi-journeys-summary')?.anotherMonth === 'yes';
const hasUserNoWantedToAddAnotherMonth = (req) => req.casa.journeyContext.getDataForPage('taxi-journeys-summary')?.anotherMonth === 'no';

const stashStateBeforeAdditionOfNewMonth = (req) => {
    stashStateForPage(req, 'travel-claim-month');
};

const restoreStateToBeforeUnsuccessfulAdditionOfNewMonth = (req) => {
    restoreStateForPage(req, 'travel-claim-month');
};

module.exports = () => ({
  view: 'pages/travel-in-work/taxi-journeys-summary.njk',
  fieldValidators,
  reviewBlockView: 'pages/travel-in-work/review/travel-during-work-claim-information.njk',
  hooks: {
    prerender: (req, res, next) => {
        res.locals.hideBackButton = true;
        if (hasUserWantedToAddAnotherMonth(req)) {
            req.casa.journeyContext.setDataForPage('taxi-journeys-summary', undefined);

            restoreStateToBeforeUnsuccessfulAdditionOfNewMonth(req);
        }
        req.casa.journeyContext.setDataForPage('taxi-journeys-summary', undefined);

        req.casa.journeyContext.setDataForPage('remove-month', {
          removeId: true,
        });

      const allData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__')
      res.locals.travelMonth = req.casa.journeyContext.getDataForPage('travel-claim-month');
      res.locals.journeyNumber = req.casa.journeyContext.getDataForPage('travel-claim-days');

      let result = [];
        if (Array.isArray(Object.values(allData))) {
            result = Object.values(allData).sort(function(a, b) {
                if (a.monthYear.yyyy === b.monthYear.yyyy) {
                    return a.monthYear.mm - b.monthYear.mm;
                } else {
                    return a.monthYear.yyyy - b.monthYear.yyyy;
                }
            });
        }
        res.locals.allData = Object.assign({}, result);
        req.casa.journeyContext.setDataForPage('__hidden_travel_page__', res.locals.allData);

      let blankArray = [];

      Object.keys(allData)
          .forEach((key) => {
              const index = parseInt(key, 10);
              const item = allData[index];

              Object.keys(item.claim)
                  .forEach((key) => {
                      const index = parseInt(key, 10);
                      const items = item.claim[index];

                      blankArray.push(parseFloat(items.costOfTravel).toFixed(2));

                  });
        });

      const totalTravelCost = blankArray.reduce((a, cv) => { return a + parseFloat(cv)}, 0);
      res.locals.totalTravelCost = totalTravelCost.toFixed(2);
      req.casa.journeyContext.setDataForPage('total-cost',{
        cost: totalTravelCost
      });
      JourneyContext.putContext(req.session, req.casa.journeyContext);

      res.locals.calculateChangeLinkUrl = calculateChangeLinkUrl;
      res.locals.calculateRemoveLinkUrl = calculateRemoveLinkUrl;


      next();
    },
    prevalidate: (req, res, next) => {
      if (req.body.remove !== undefined) {

        req.casa.journeyContext.setDataForPage('remove-month', {
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
            req.casa.journeyContext.setDataForPage('remove-month', {
                removeId: false,
            });
            const allData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
            const keysLength = Object.keys(allData).length;
            const newMonthIndex = parseInt(Object.keys(allData)[keysLength - 1], 10) + 1;

            req.casa.journeyContext.setDataForPage('travel-claim-days', undefined);
            stashStateBeforeAdditionOfNewMonth(req);
            req.casa.journeyContext.setDataForPage('travel-claim-month', {
                monthIndex: newMonthIndex.toString(),
            });
            JourneyContext.putContext(req.session, req.casa.journeyContext);

            req.session.save((err) => {
                if (err) {
                    throw err;
                }
                return next();
            });
        } else if (hasUserNoWantedToAddAnotherMonth(req)) {
            req.casa.journeyContext.setDataForPage('remove-month', {
                removeId: false,
            });
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
