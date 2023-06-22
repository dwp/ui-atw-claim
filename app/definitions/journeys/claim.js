const {
  CLAIM_CONTEXT_PATH,
} = require('../../config/uri');

const journey = (plan) => {
  plan.addOrigin(CLAIM_CONTEXT_PATH.replace('/', ''), 'select-support-to-claim');
};

module.exports = journey;
