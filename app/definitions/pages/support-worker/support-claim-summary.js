const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/support-worker/support-claim-summary');
const logger = require('../../../logger/logger');
const { stashStateForPage, restoreStateForPage } = require('../../../utils/stash-util');
const { claimTypesShortName } = require('../../../config/claim-types');
const { getChangeLinkCalculatorMonthChange, getRemoveLinkCalculatorMonthRemove } = require('../../../utils/link-util');

const { calculateChangeLinkUrl } = getChangeLinkCalculatorMonthChange(claimTypesShortName.SUPPORT_WORKER);

const { calculateRemoveLinkUrl } = getRemoveLinkCalculatorMonthRemove(claimTypesShortName.SUPPORT_WORKER);

const log = logger('support-worker:support-claim-summary');

const hasUserWantedToAddAnotherMonth = (req) => req.casa.journeyContext.getDataForPage('support-claim-summary')?.anotherMonth === 'yes';
const hasUserNoWantedToAddAnotherMonth = (req) => req.casa.journeyContext.getDataForPage('support-claim-summary')?.anotherMonth === 'no';

const stashStateBeforeAdditionOfNewMonth = (req) => {
  stashStateForPage(req, 'support-month');
};

const restoreStateToBeforeUnsuccessfulAdditionOfNewMonth = (req) => {
  restoreStateForPage(req, 'support-month');
};

module.exports = () => ({
  view: 'pages/support-worker/support-claim-summary.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.hideBackButton = true;
      if (hasUserWantedToAddAnotherMonth(req)) {
        req.casa.journeyContext.setDataForPage('support-claim-summary', undefined);

        restoreStateToBeforeUnsuccessfulAdditionOfNewMonth(req);
      }
      // Clear any data so if user used back button from the remove screen this data is cleared
      req.casa.journeyContext.setDataForPage('support-claim-summary', undefined);

      req.casa.journeyContext.setDataForPage('remove-month', {
        removeId: true,
      });

      const allData = req.casa.journeyContext.getDataForPage('__hidden_support_page__');

      res.locals.supportMonth = req.casa.journeyContext.getDataForPage('support-month');
      res.locals.supportDays = req.casa.journeyContext.getDataForPage('support-days');
      res.locals.supportHours = req.casa.journeyContext.getDataForPage('support-hours');
      res.locals.supportHiddenPage = req.casa.journeyContext.getDataForPage('__hidden_support_page__');

      const hiddenPreviousMonthHours = req.casa.journeyContext.getDataForPage('__hidden_support_page__');

      let arrayHours = [];
      let arrayMinutes = [];
      let keys = Object.keys(hiddenPreviousMonthHours);
      for (let i = 0; i < keys.length; i++) {
          for (let e = 0; e < hiddenPreviousMonthHours[keys[i]].claim.length; e++) {
            arrayHours.push(parseInt(hiddenPreviousMonthHours[keys[i]].claim[e].timeOfSupport.hoursOfSupport));
            arrayMinutes.push(parseInt(hiddenPreviousMonthHours[keys[i]].claim[e].timeOfSupport.minutesOfSupport));
          }
        }

        const convertedHours = arrayHours.reduce((a, cv) => { return a + cv}, 0);
        const convertedMinutes = arrayMinutes.reduce((a, cv) => { return a + cv}, 0)
        const totalMinutes = (convertedHours * 60) + convertedMinutes;
        const totalHours = (totalMinutes / 60);
        const roundedHours = Math.floor(totalHours);
        const roundedMinutes = Math.round((totalHours - roundedHours) * 60);

        res.locals.totalRoundedHours = roundedHours;
        res.locals.totalRoundedMinutes = roundedMinutes;

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
        req.casa.journeyContext.setDataForPage('__hidden_support_page__', res.locals.allData);
        res.locals.monthYear = req.casa.journeyContext.getDataForPage('support-month').dateOfSupport;
        res.locals.calculateChangeLinkUrl = calculateChangeLinkUrl;
        res.locals.calculateRemoveLinkUrl = calculateRemoveLinkUrl;

        next();
    },
    postvalidate: (req, res, next) => {
      // If user wants to add another month clear users answers
      if (hasUserWantedToAddAnotherMonth(req)) {
        log.debug('Add another month');
        req.casa.journeyContext.setDataForPage('remove-month', {
          removeId: false,
      });
        const allData = req.casa.journeyContext.getDataForPage('__hidden_support_page__');
        const keysLength = Object.keys(allData).length;
        const newMonthIndex = parseInt(Object.keys(allData)[keysLength - 1], 10) + 1;

        log.debug(`Key length ${keysLength}`);
        log.debug(`new month index length ${newMonthIndex}`);
        log.debug(allData);

        req.casa.journeyContext.setDataForPage('support-days', undefined);
        stashStateBeforeAdditionOfNewMonth(req);
        req.casa.journeyContext.setDataForPage('support-month', {
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
