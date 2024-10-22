const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/equipment-or-adaptation/remove-specialist-equipment');

module.exports = () => ({
  view: 'pages/equipment-or-adaptation/remove-specialist-equipments.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      const summaryPageData = req.casa.journeyContext.getDataForPage('__hidden_specialist_equipment_page__');
      res.locals.summaryPageData = summaryPageData;
      res.locals.removeId = req.query.remove;
      req.session.save((err) => {
        if (err) {
          throw err;
        }
        return next();
      });
    },
    postvalidate: (req, res, next) => {
      const pageData = req.casa.journeyContext.getDataForPage('remove-specialist-equipments');
      req.casa.journeyContext.setDataForPage('remove-specialist-equipments', undefined);
      if (req.inEditMode) {
        // Ensured that the data is set to make it go to the remove page rather than the summary
        req.casa.journeyContext.setDataForPage('specialist-equipment-summary', { addAnother: 'no' });
      } else {
        req.casa.journeyContext.setDataForPage('specialist-equipment-summary', undefined);
      }
      if (pageData.removeSpecialistEquipment === 'yes') {
        const summaryPageData = req.casa.journeyContext.getDataForPage('__hidden_specialist_equipment_page__');
        delete summaryPageData[req.query.remove];
        req.casa.journeyContext.setDataForPage('__hidden_specialist_equipment_page__', summaryPageData);
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
