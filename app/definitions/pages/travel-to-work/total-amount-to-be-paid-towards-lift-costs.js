const fieldValidators = require('../../field-validators/common/optional-validator');

module.exports = () => ({
  view: 'pages/travel-to-work/total-amount-to-be-paid-towards-lift-costs.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.journeysOrMileage = req.casa.journeyContext.getDataForPage('journey-or-mileage')?.journeysOrMileage;

      const allData = req.casa.journeyContext.getDataForPage('__hidden_travel_page__');
      let travelTotal = 0;

      Object.values(allData)
        .forEach((month) => {
          month.claim.forEach((day) => {
            travelTotal += parseFloat(day.totalTravel);
          });
        });

      res.locals.travelTotal = travelTotal;

      next();
    },
  },
});
