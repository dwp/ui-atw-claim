const commonMappings = require('../common/_mappings');

const avMappings = {
  'vehicle-adaptations-claim': {
    showInJson: false,
  },
  'your-vehicle-adaptations': {
    showInJson: false,
  },
  'vehicle-adaptations-summary': {
    showInJson: false,
  },
  'vehicle-adaptations-cost': {
    showInJson: true,
    outputFieldName: 'cost',
    showSingleField: 'totalCost',
  },
  __hidden_vehicle_adaptations_page__: {
    showInJson: true,
    outputFieldName: 'claim',
  },
};

const mappings = Object.assign(avMappings, commonMappings.mappings);

module.exports = {
  mappings,
};
