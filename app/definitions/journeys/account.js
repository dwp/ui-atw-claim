const {
  ACCOUNT_CONTEXT_PATH,
} = require('../../config/uri');

const journey = (plan) => {
  plan.setRoute('multiple-claims-history', 'claims-history');
  plan.addOrigin(ACCOUNT_CONTEXT_PATH.replace('/', ''), 'multiple-claims-history');
};

module.exports = journey;
