const fieldValidators = require('../../field-validators/support-worker/support-worker-or-agency-name');

module.exports = () => ({
  view: 'pages/support-worker/support-worker-or-agency-name.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      // Only on this page when adding a new month when on
      // edit mode so add a new month for every visit
      if (req.inEditMode) {
        res.locals.supportWorkerOrAgency = req.casa.journeyContext.getDataForPage('support-worker-or-agency-name').supportWorkerOrAgencyName;
      } else {
        res.locals.supportWorkerOrAgency = req.casa.journeyContext.getDataForPage('support-worker-or-agency-name')?.supportWorkerOrAgencyName ?? '';
      }
      next();
    },
  },
});
