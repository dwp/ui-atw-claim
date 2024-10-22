const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/travel-to-work/days-you-travelled-for-work');
const logger = require('../../../logger/logger');
const { removeAllSpaces } = require('../../../utils/remove-all-spaces');
const getAllDates = require('../../../custom-validators/helpers/utils/get-dates-in-week-format');

const log = logger('travel-to-work:days-you-travelled-for-work');

module.exports = () => ({
  view: 'pages/travel-to-work/days-you-travelled-for-work.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      // Returns undefined for taxi route. If lift return miles or journey
      // as this only defined on that journey
      res.locals.journeysOrMileage = req.casa.journeyContext
        .getDataForPage('journeys-miles')?.journeysOrMileage;

      // Change from summary not CYA
      if (req.query.changeMonthYear) {
        log.debug(`Change ${req.query.changeMonthYear}`);
        const allData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
        const dataToReloadForChange = allData[req.query.changeMonthYear];
        res.locals.arrayDates = getAllDates(dataToReloadForChange.monthYear.yyyy, dataToReloadForChange.monthYear.mm)
        res.locals.dateOfTravel = dataToReloadForChange.monthYear;
        res.locals.monthYearOfTravel = dataToReloadForChange.monthYear;

        // Extract total number of journeys per day for journeyContext to pass data through to njk file for retention
        const journeyOrMiles = [];
        for (let i=0; i < dataToReloadForChange.claim.length; i++) {

          const journeyDay = {
            "dayOfTravel": dataToReloadForChange.claim[i].dayOfTravel,
            "totalTravel": dataToReloadForChange.claim[i].totalTravel
          };

          journeyOrMiles.push(journeyDay)
        }


        req.casa.journeyContext.setDataForPage('travel-month', {
          monthIndex: req.query.changeMonthYear,
          dateOfTravel: dataToReloadForChange.monthYear,
        });
        req.casa.journeyContext.setDataForPage('travel-days', {
          day: dataToReloadForChange.claim,
        });
        res.locals.monthYearOfTravel = req.casa.journeyContext.getDataForPage('travel-month').dateOfTravel;

        let days = [];
        for (let i=0; i<journeyOrMiles.length; i++) {
          days.push(journeyOrMiles[i].dayOfTravel);
        }
        res.locals.days = days;
        res.locals.reloadData = journeyOrMiles;

        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return next();
        });
      } else {

        const dateOfTravel = req.casa.journeyContext.getDataForPage('travel-month').dateOfTravel;
        res.locals.arrayDates = getAllDates(dateOfTravel.yyyy, dateOfTravel.mm);
        res.locals.dateOfTravel = dateOfTravel;
        res.locals.monthYearOfTravel = req.casa.journeyContext.getDataForPage('travel-month').dateOfTravel;

        const pageData = req.casa.journeyContext.getDataForPage('travel-days');

        if (pageData === undefined) {
          log.debug('Initial population');

          const data = {
            day: [{
              dayOfTravel: '',
              totalTravel: '',
            }],
          };

          req.casa.journeyContext.setDataForPage('travel-days', data);
          JourneyContext.putContext(req.session, req.casa.journeyContext);
          req.session.save((err) => {
            if (err) {
              throw err;
            }
            next();
          });
        } else {
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

          });

      next();
    },
    postvalidate: (req, res, next) => {
      // Submit clicked
      const monthYearOfTravel = req.casa.journeyContext.getDataForPage('travel-month');
      const hiddenPage = req.casa.journeyContext.getDataForPage('__hidden_travel_page__') ?? Object.create(null);

      const pageData = req.body.dateOfTravel

      let pageDataArrayParseInt = [];
      let dayAndJourneyList = [];

      for (let i = 0; i < pageData.length; i++) {
        pageDataArrayParseInt.push(parseInt(pageData[i].dateOfTravel))
        if (!isNaN(pageDataArrayParseInt[i])) {
          const daysOfTravel = {
            dayOfTravel: i + 1,
            totalTravel: pageDataArrayParseInt[i]
          };
          dayAndJourneyList.push(daysOfTravel);
        };
      };

      hiddenPage[monthYearOfTravel.monthIndex] = {
        monthYear: monthYearOfTravel.dateOfTravel,
        claim: dayAndJourneyList,
      };

      req.casa.journeyContext.setDataForPage('__hidden_travel_page__', hiddenPage);

      if (!req.inEditMode) {
        req.casa.journeyContext.setDataForPage('journey-summary', undefined);
      }
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
