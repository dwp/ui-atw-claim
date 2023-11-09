const {
  GRANT_CONTEXT_PATH,
} = require('../../config/uri');

const journey = (plan) => {
  plan.setRoute('multiple-grant-select', 'multiple-job-select');
  plan.setRoute('multiple-job-select', 'grant-summary');
  plan.addOrigin(GRANT_CONTEXT_PATH.replace('/', ''), 'multiple-grant-select');
};

module.exports = journey;
