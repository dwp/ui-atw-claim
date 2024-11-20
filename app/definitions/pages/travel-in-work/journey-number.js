const fieldValidators = require('../../field-validators/travel-in-work/journey-number');
const { TRAVEL_IN_WORK_ROOT_URL } = require('../../../config/uri');
const { removeAllSpaces, removeLeadingZero } = require('../../../utils/remove-all-spaces');
const getAllDates = require('../../../custom-validators/helpers/utils/get-dates-in-week-format');
const JourneyContext = require("@dwp/govuk-casa/lib/JourneyContext");
const logger = require('../../../logger/logger');

const log = logger('travel-in-work:journey-number');

module.exports = () => ({
  view: 'pages/travel-in-work/journey-number.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const allData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');

      if (req.casa.journeyContext.getDataForPage('taxi-journeys-summary')?.anotherMonth === 'yes') {
        res.locals.casa.journeyPreviousUrl = `${TRAVEL_IN_WORK_ROOT_URL}/taxi-journeys-summary`;
      }

      // Change from summary not CYA
      if (req.query.changeMonthYear) {
        log.debug(`Change ${req.query.changeMonthYear}`);
        const dataToReloadForChange = allData[req.query.changeMonthYear];
        res.locals.arrayDates = getAllDates(dataToReloadForChange.monthYear.yyyy, dataToReloadForChange.monthYear.mm)
        res.locals.dateOfTravel = dataToReloadForChange.monthYear;
        res.locals.monthYearOfSupport = dataToReloadForChange.monthYear;

        // Extract total number of journeys per day for journeyContext to pass data through to njk file for retention
        const journeyDays = [];
        for (let i=0; i < dataToReloadForChange.claim.length; i++) {
          let journeyNumber = 1;
          if (dataToReloadForChange.claim[i+1]) {
            while (i<dataToReloadForChange.claim.length - 1 && (dataToReloadForChange.claim[i].dayOfTravel == dataToReloadForChange.claim[i + 1].dayOfTravel)) {
              journeyNumber++;
              i++;
            }
          }

          const journeyDay = {
            "indexDay": dataToReloadForChange.claim[i].dayOfTravel,
            "journeyNumber": journeyNumber
          };

          journeyDays.push(journeyDay)
        }

        log.info(dataToReloadForChange.claim);
        req.casa.journeyContext.setDataForPage('travel-claim-month', {
          monthIndex: req.query.changeMonthYear,
          dateOfTravel: dataToReloadForChange.monthYear,
        });
        req.casa.journeyContext.setDataForPage('travel-claim-days', {
          day: journeyDays,
        });
        let days = [];
        for (let i=0; i<journeyDays.length; i++) {
          days.push(journeyDays[i].indexDay);
        }
        res.locals.days = days;
        res.locals.reloadData = journeyDays;

        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return next();
        });
      } else {

        const dateOfTravel = req.casa.journeyContext.getDataForPage('travel-claim-month').dateOfTravel;
        res.locals.arrayDates = getAllDates(dateOfTravel.yyyy, dateOfTravel.mm);
        res.locals.dateOfTravel = dateOfTravel;
        res.locals.monthYearOfSupport = req.casa.journeyContext.getDataForPage('travel-claim-month').dateOfTravel;

        const pageData = req.casa.journeyContext.getDataForPage('travel-claim-days');
        if (pageData === undefined) {
          log.debug('Initial population');

          const data = {
            daysOfSupport: [],
          };
          req.casa.journeyContext.setDataForPage('travel-claim-days', data);
          JourneyContext.putContext(req.session, req.casa.journeyContext);

          req.session.save((err) => {
            if (err) {
              throw err;
            }
            next();
          });
        } else {
          res.locals.days = pageData.daysOfSupport;
          next();
        }
      }


    },
    pregather: (req, res, next) => {
      const dateOfTravel = req.body.dateOfTravel;

      Object.keys(dateOfTravel)
          .forEach((day) => {
            const index = parseInt(day, 10);
            const item = dateOfTravel[index];

            item.dateOfTravel = removeAllSpaces(item.dateOfTravel)
            item.dateOfTravel = removeLeadingZero(item.dateOfTravel)

          });

      next();
    },
    preredirect: (req, res, next) => {
      if (req.inEditMode) { 
         JourneyContext.putContext(req.session, req.casa.journeyContext);
 
         req.session.save((err) => {
           if (err) {
             throw err;
           }
           res.redirect(`journey-details?edit=&editorigin=${req.editOriginUrl}`);
         });
       } else {
         next();
       }
     },
    postvalidate: (req, res, next) => {
      const pageData = req.body.dateOfTravel

      let pageDataArrayParseInt = [];
      let dayAndJourneyList = [];

      for (let i = 0; i < pageData.length; i++) {
        pageDataArrayParseInt.push(parseInt(pageData[i].dateOfTravel))
        if (!isNaN(pageDataArrayParseInt[i])) {
          const daysOfTravel = {
            indexDay: i + 1,
            journeyNumber: pageDataArrayParseInt[i]
          };
          dayAndJourneyList.push(daysOfTravel);
        };
      };

      req.casa.journeyContext.setDataForPage('travel-claim-days', dayAndJourneyList);

      next();
    },
  },
});
