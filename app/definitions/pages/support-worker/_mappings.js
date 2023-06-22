const commonMappings = require('../common/_mappings');

const swMappings = {
  'support-worker-claim': {
    showInJson: false,
  },
  'month-claiming-support-worker-costs': {
    showInJson: false,
  },
  'support-cost': {
    showInJson: true,
    outputFieldName: 'cost',
    showSingleField: 'totalCost',
  },
  'days-you-had-support': {
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
