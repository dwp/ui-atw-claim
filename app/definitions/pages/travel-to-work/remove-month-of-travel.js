const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/travel-to-work/remove-month-of-travel');
const logger = require('../../../logger/logger');

const log = logger('travel-to-work:remove-month-of-support');

module.exports = () => ({
  view: 'pages/travel-to-work/remove-month-of-travel.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const summaryPageData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
      res.locals.summaryPageData = summaryPageData;
      res.locals.removeId = req.query.remove;

      // grabbing current month from url id to display on nunjucks
      const monthsEng = ["January","February","March","April","May","June","July","August","September","October","November","December"];
      const monthsCy = ["Ionawr", "Chwefror", "Mawrth", "Ebrill", "Mai", "Mehefin", "Gorffennaf", "Awst", "Medi", "Hydref", "Tachwedd", "Rhagfyr"]
      
      const base = `${req.protocol}://${req.get('host')}`;
      const currentURL = new URL(res.locals.currentUrl, base);
      const grabMonthId = currentURL.searchParams.get('remove');
      
      const entry = res.locals.summaryPageData[grabMonthId]

      if (entry) {
        let monthName = '';
        if (req.casa.journeyContext.nav.language == 'en') {
          monthName = monthsEng[parseInt(entry.monthYear.mm,10)-1];
        } else {
          monthName = monthsCy[parseInt(entry.monthYear.mm,10)-1];
        }
        const year = entry.monthYear.yyyy;

        res.locals.monthYear = `${monthName} ${year}`;
      }
      next();
    },
    postvalidate: (req, res, next) => {
      const pageData = req.casa.journeyContext.getDataForPage('remove-travel-month');
      req.casa.journeyContext.setDataForPage('remove-travel-month', undefined);
      if(req.inEditMode) {
        // Ensured that the data is set to make it go to the remove page rather than the summary
        req.casa.journeyContext.setDataForPage('journey-summary', { anotherMonth: 'no' });
      } else {
        req.casa.journeyContext.setDataForPage('journey-summary', undefined);
      }
      if (pageData.removeMonthOfTravel === 'yes') {
        const summaryPageData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
        log.debug(`Month to delete ${req.query.remove}`);
        delete summaryPageData[req.query.remove];
        req.casa.journeyContext.setDataForPage('__hidden_travel_page__', summaryPageData);
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
