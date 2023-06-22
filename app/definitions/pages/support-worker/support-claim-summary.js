const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/support-worker/support-claim-summary');
const logger = require('../../../logger/logger');
const { sumNestedAttributeForClaim } = require('../../../utils/claim-util');
const { stashStateForPage, restoreStateForPage } = require('../../../utils/stash-util');
const { claimTypesShortName } = require('../../../config/claim-types');
const { getChangeLinkCalculator } = require('../../../utils/link-util');

const { calculateChangeLinkUrl } = getChangeLinkCalculator(claimTypesShortName.SUPPORT_WORKER);

const log = logger('support-worker:support-claim-summary');

const calculateTotalHoursOfSupportAcrossAllClaims = (allData) => sumNestedAttributeForClaim(allData, 'timeOfSupport', 'hoursOfSupport');

const calculateTotalMinutesOfSupportAcrossAllClaims = (allData) => sumNestedAttributeForClaim(allData, 'timeOfSupport', 'minutesOfSupport');

const hasUserWantedToAddAnotherMonth = (req) => req.casa.journeyContext.getDataForPage('support-claim-summary')?.anotherMonth === 'yes';

const stashStateBeforeAdditionOfNewMonth = (req) => {
  stashStateForPage(req, 'month-claiming-support-worker-costs');
};

const restoreStateToBeforeUnsuccessfulAdditionOfNewMonth = (req) => {
  restoreStateForPage(req, 'month-claiming-support-worker-costs');
};

module.exports = () => ({
  view: 'pages/support-worker/support-claim-summary.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      if (hasUserWantedToAddAnotherMonth(req)) {
        req.casa.journeyContext.setDataForPage('support-claim-summary', undefined);

        restoreStateToBeforeUnsuccessfulAdditionOfNewMonth(req);
      }
      // Clear any data so if user used back button from the remove screen this data is cleared
      req.casa.journeyContext.setDataForPage('remove-month-of-support', undefined);
      const allData = req.casa.journeyContext.getDataForPage('__hidden_support_page__');
      res.locals.supportHourTotal = calculateTotalHoursOfSupportAcrossAllClaims(allData);
      res.locals.supportMinuteTotal = calculateTotalMinutesOfSupportAcrossAllClaims(allData);

      const totalMinutes = (res.locals.supportHourTotal * 60) + res.locals.supportMinuteTotal;
      const totalHours = (totalMinutes / 60);
      const roundedHours = Math.floor(totalHours);
      const roundedMinutes = Math.round((totalHours - roundedHours) * 60);

      res.locals.totalRoundedHours = roundedHours;
      res.locals.totalRoundedMinutes = roundedMinutes;
      res.locals.allData = allData;
      res.locals.monthYear = req.casa.journeyContext.getDataForPage('month-claiming-support-worker-costs').dateOfSupport;
      res.locals.calculateChangeLinkUrl = calculateChangeLinkUrl;
      next();
    },
    prevalidate: (req, res, next) => {
      if (req.body.remove !== undefined) {
        log.debug('Remove button clicked');

        req.casa.journeyContext.setDataForPage('remove-month-of-support', {
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

        const allData = req.casa.journeyContext.getDataForPage('__hidden_support_page__');
        const keysLength = Object.keys(allData).length;
        const newMonthIndex = parseInt(Object.keys(allData)[keysLength - 1], 10) + 1;

        log.debug(`Key length ${keysLength}`);
        log.debug(`new month index length ${newMonthIndex}`);
        log.debug(allData);

        req.casa.journeyContext.setDataForPage('days-you-had-support', undefined);
        stashStateBeforeAdditionOfNewMonth(req);
        req.casa.journeyContext.setDataForPage('month-claiming-support-worker-costs', {
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
