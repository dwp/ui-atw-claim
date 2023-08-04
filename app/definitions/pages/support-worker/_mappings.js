const commonMappings = require('../common/_mappings');

const swMappings = {
  'support-worker-claim': {
    showInJson: false,
  },
  'support-month': {
    showInJson: false,
  },
  'support-cost': {
    showInJson: true,
    outputFieldName: 'cost',
    showSingleField: 'totalCost',
  },
  'support-days': {
    showInJson: false,
  },
  'support-claim-summary': {
    showInJson: false,
  },
  __hidden_support_page__: {
    showInJson: true,
    outputFieldName: 'claim',
  },
};

const mappings = Object.assign(swMappings, commonMappings.mappings);

module.exports = {
  mappings,
};
