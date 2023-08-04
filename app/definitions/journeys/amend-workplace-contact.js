const {
  WORKPLACE_CONTACT_CONTEXT_PATH,
} = require('../../config/uri');

const journey = (plan) => {
  plan.setRoute('amend-confirmer-details', 'amend-check-confirmer-details');

  plan.addOrigin(WORKPLACE_CONTACT_CONTEXT_PATH.replace('/', ''), 'amend-confirmer-details');
};

module.exports = journey;
