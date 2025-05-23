const fieldValidators = require('../../field-validators/travel-in-work/journey-details');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const { removeAllSpaces } = require('../../../utils/remove-all-spaces');
const logger = require('../../../logger/logger');
const { DECIMAL_MATCH, DECIMAL_TEST_CURRENCY, COMMA, CURRENCY } = require('../../../config/regex-definitions');

const log = logger('travel-in-work:journey-details');

module.exports = () => ({
  view: 'pages/travel-in-work/journey-details.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const allData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
        const days = req.casa.journeyContext.getDataForPage('travel-claim-days');
        const monthYear = req.casa.journeyContext.getDataForPage('travel-claim-month');

        let weekDays = [];

        for (let i = 0; i < days.length; i++) {
            let weekDay = new Date(monthYear.dateOfTravel.yyyy, monthYear.dateOfTravel.mm - 1, days[i].indexDay).getDay();

            const dateDisplay = {
                'day': days[i].indexDay,
                'weekday' : weekDay,
                'month' : monthYear.dateOfTravel.mm
            }

            weekDays.push(dateDisplay);
        }
        res.locals.weekDays = weekDays;

      // Change from summary not CYA
      if (req.headers.referer.includes("changeMonthYear", 0)) {
        log.debug(`Change ${req.headers.referer.includes("changeMonthYear", 0)}`);
        log.debug(allData);
        const daysOfTravelReloadForChange = allData[monthYear.monthIndex];

        // Compare new data entered with existing data in journeyContext to see if clear down of data needs to be done
          const newJourneyDays = req.casa.journeyContext.getDataForPage('travel-claim-days');

          const journeyDays = [];
          for (let i=0; i < daysOfTravelReloadForChange.claim.length; i++) {
              let journeyNumber = 1;
              if (daysOfTravelReloadForChange.claim[i+1]) {
                  while (i<daysOfTravelReloadForChange.claim.length - 1 && (daysOfTravelReloadForChange.claim[i].dayOfTravel == daysOfTravelReloadForChange.claim[i + 1].dayOfTravel)) {
                      journeyNumber++;
                      i++;
                  }
              }

              const journeyDay = {
                  "indexDay": daysOfTravelReloadForChange.claim[i].dayOfTravel,
                  "journeyNumber": journeyNumber
              };

              journeyDays.push(journeyDay)
          }

          if (journeyDays.length < newJourneyDays.length) {
              req.casa.journeyContext.setDataForPage('journey-details', {
                  journeyDetails: daysOfTravelReloadForChange.claim,
              });
          } else if (journeyDays.length == newJourneyDays.length) {
              if (JSON.stringify(journeyDays) == JSON.stringify(newJourneyDays)) {
                  req.casa.journeyContext.setDataForPage('journey-details', {
                      journeyDetails: daysOfTravelReloadForChange.claim,
                  });
              } else {
                  for(let i =0; i<journeyDays.length; i++) {
                      if ((journeyDays[i].journeyNumber < newJourneyDays[i].journeyNumber)) {
                          req.casa.journeyContext.setDataForPage('journey-details', {
                              journeyDetails: daysOfTravelReloadForChange.claim,
                          });
                      } else {
                          req.casa.journeyContext.setDataForPage('journey-details', undefined);
                      }
                  }
              }
          } else if (journeyDays.length > newJourneyDays.length) {
              req.casa.journeyContext.setDataForPage('journey-details', undefined);
          }


        let reloadWeekDays = [];
        for (let i=0; i<daysOfTravelReloadForChange.claim.length; i++) {
            reloadWeekDays.push(daysOfTravelReloadForChange.claim[i]);
        }
        res.locals.reloadData = reloadWeekDays;
        res.locals.monthYearOfSupport = req.casa.journeyContext.getDataForPage('travel-claim-month').dateOfTravel;
        res.locals.monthYear = monthYear.dateOfTravel;
        res.locals.days = days;

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return next();
        });
      } else {
        const days = req.casa.journeyContext.getDataForPage('travel-claim-days');
        const monthYear = req.casa.journeyContext.getDataForPage('travel-claim-month');
        res.locals.monthYear = monthYear.dateOfTravel;
        res.locals.days = days;
        res.locals.weekDays = weekDays;

        const pageData = req.casa.journeyContext.getDataForPage('travel-claim-days');

        if (pageData === undefined) {
          log.debug('Initial population');

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
        const travelClaimedDays = req.casa.journeyContext.getDataForPage('travel-claim-days');

        for(let i = 0; i < travelClaimedDays.length; i++) {
          for (let j = 0; j < travelClaimedDays[i].journeyNumber; j++) {
            req.body.journeyDetails[i][j].startPostcode = removeAllSpaces(req.body.journeyDetails[i][j].startPostcode);
            req.body.journeyDetails[i][j].endPostcode = removeAllSpaces(req.body.journeyDetails[i][j].endPostcode);
            req.body.journeyDetails[i][j].totalCost = removeAllSpaces(req.body.journeyDetails[i][j].totalCost);

            const hasDecimal = DECIMAL_TEST_CURRENCY.test(req.body.journeyDetails[i][j].totalCost)
            if((req.body.journeyDetails[i][j].totalCost) !== '') {
              log.debug("not null, " + req.body.journeyDetails[i][j].totalCost)
              if(hasDecimal) {
                //split on the last decimal separator (. or ,)
                const match = req.body.journeyDetails[i][j].totalCost.match(DECIMAL_MATCH);
                let [ , totalCost, , decimal ] = match;
                if((req.body.journeyDetails[i][j].totalCost).match(CURRENCY)) {
                  totalCost = totalCost.replace(COMMA, ''); //remove all commas from whole body
                  req.body.journeyDetails[i][j].totalCost = Number.parseFloat(`${totalCost}.${decimal}`).toFixed(2); // force decimal separator to be . not ,
                }
              } else {
                if((req.body.journeyDetails[i][j].totalCost).match(CURRENCY)) {
                  let totalCost;
                  totalCost = req.body.journeyDetails[i][j].totalCost.replace(COMMA, ''); //remove all commas from whole body
                  req.body.journeyDetails[i][j].totalCost = Number.parseFloat(totalCost).toFixed(2) // add two decimal place if not provided
                }
              }
              log.debug("output, " + req.body.journeyDetails[i][j].totalCost)
            }
          }
        }
        next();
    },
    preredirect: (req, res, next) => {
      if (req.inEditMode) {
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect(`taxi-journeys-summary?edit=&editorigin=${req.editOriginUrl}`);
        });
      } else {
        next();
      }

    },
    postvalidate: (req, res, next) => {
        const pageData = req.casa.journeyContext.getDataForPage('journey-details');
        const travelClaimedDays = req.casa.journeyContext.getDataForPage('travel-claim-days');
        const dateOfTravel = req.casa.journeyContext.getDataForPage('travel-claim-month');
        const claim = req.casa.journeyContext.getDataForPage('__hidden_travel_page__') ?? Object.create(null);

        let journeys = [];

        for(let i = 0; i < travelClaimedDays.length; i++) {
            for (let j = 0; j < travelClaimedDays[i].journeyNumber; j++) {
                const journeyDetail = {
                    "dayOfTravel": travelClaimedDays[i].indexDay,
                    "startPostcode": pageData.journeyDetails[i][j].startPostcode,
                    "endPostcode": pageData.journeyDetails[i][j].endPostcode,
                    "costOfTravel": parseFloat(pageData.journeyDetails[i][j].totalCost).toFixed(2),
                  };
              journeys.push(journeyDetail);
            }
        }
        claim[dateOfTravel.monthIndex] = {
            monthYear: dateOfTravel.dateOfTravel,
            claim: journeys
          };

        req.casa.journeyContext.setDataForPage('__hidden_travel_page__', claim);

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
