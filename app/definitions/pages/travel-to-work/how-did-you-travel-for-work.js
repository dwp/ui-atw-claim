const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require(
  '../../field-validators/travel-to-work/how-did-you-travel-for-work',
);
const logger = require('../../../logger/logger');
const { deleteFile } = require('../../../lib/controllers/evidence-handler-controller');

const log = logger('travel-to-work:how-did-your-travel-for-work');

module.exports = () => ({
  view: 'pages/travel-to-work/how-did-you-travel-for-work.njk',
  fieldValidators,
  hooks: {
    postvalidate: async (req, res, next) => {
      // Clear answers if change from taxi to lift or visa versa
      const newAnswer = req.casa.journeyContext.getDataForPage(
        'which-journey-type',
      ).howDidYouTravelForWork;
      const oldAnswer = req.casa.journeyContext.getDataForPage(
        '__hidden_how_did_you_travel_for_work__',
      )?.howDidYouTravelForWork;

      if (newAnswer !== oldAnswer) {
        log.debug(`Clear answers for travel pages. Old: ${oldAnswer} New: ${newAnswer}`);

        req.casa.journeyContext.setValidationErrorsForPage('travel-month');
        req.casa.journeyContext.setValidationErrorsForPage('travel-days');

        req.casa.journeyContext.setDataForPage('travel-month', undefined);
        req.casa.journeyContext.setDataForPage('travel-days', undefined);
        req.casa.journeyContext.setDataForPage('journeys-miles', undefined);
        req.casa.journeyContext.setDataForPage('taxi-journeys-cost', undefined);
        req.casa.journeyContext.setDataForPage('remove-travel-month', undefined);
        req.casa.journeyContext.setDataForPage('__hidden_travel_page__', undefined);
        req.casa.journeyContext.setDataForPage(
          '__hidden_how_did_you_travel_for_work__',
          { howDidYouTravelForWork: newAnswer },
        );

        const files = req.casa.journeyContext.getDataForPage('__hidden_uploaded_files__')?.files;

        if (files !== undefined && files.length > 0) {
          const results = [];
          for (const file of files) {
            log.debug(`Deleted file ${file.fileId}`);
            results.push(deleteFile(file.fileId));
          }
          await Promise.all(results);
          req.casa.journeyContext.setDataForPage('__hidden_uploaded_files__', undefined);
        }
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
