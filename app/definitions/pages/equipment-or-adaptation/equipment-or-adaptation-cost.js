const fieldValidators = require('../../field-validators/equipment-or-adaptation/equipment-or-adaptation-cost');
const { removeAllSpaces } = require('../../../utils/remove-all-spaces');
const { DECIMAL_MATCH, DECIMAL_TEST_CURRENCY, COMMA, CURRENCY } = require('../../../config/regex-definitions');

 
module.exports = () => ({
  view: 'pages/equipment-or-adaptation/equipment-or-adaptation-cost.njk',
  fieldValidators,
  hooks: {
    pregather: (req, res, next) => {
      req.body.totalCost = removeAllSpaces(req.body.totalCost);
      if(req.body.totalCost) {
        const hasDecimal = (req.body.totalCost).match(DECIMAL_TEST_CURRENCY);
        if(hasDecimal) {
          //split on the last decimal separator (. or ,)
          const match = req.body.totalCost.match(DECIMAL_MATCH);
          let [ , totalCost, , decimal ] = match;
          if((req.body.totalCost).match(CURRENCY)) {
            totalCost = totalCost.replace(COMMA, ''); //remove all commas from whole body
            req.body.totalCost = Number.parseFloat(`${totalCost}.${decimal}`).toFixed(2); // force decimal separator to be . not ,
          }
        } else {
          if((req.body.totalCost).match(CURRENCY)) {
            let totalCost;
            totalCost = req.body.totalCost.replace(COMMA, ''); //remove all commas from whole body
            req.body.totalCost = Number.parseFloat(totalCost).toFixed(2) // add two decimal place if not provided
          }
        }
      }
      next();
    },
  },
});
