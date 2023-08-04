const {
  ACCOUNT_CONTEXT_PATH,
} = require('../../config/uri');

const journey = (plan) => {
  plan.setRoute('your-claims-multiple', 'your-claims');
  plan.addOrigin(ACCOUNT_CONTEXT_PATH.replace('/', ''), 'your-claims-multiple');
};

module.exports = journey;
