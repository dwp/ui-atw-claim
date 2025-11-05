const {
  PAYMENTS_CONTEXT_PATH,
} = require('../../config/uri');

const journey = (plan) => {
  plan.addOrigin(PAYMENTS_CONTEXT_PATH.replace('/', ''), 'select-payments-to-view');
  plan.setRoute('select-payments-to-view', 'your-claims-payments');
};

module.exports = journey;
