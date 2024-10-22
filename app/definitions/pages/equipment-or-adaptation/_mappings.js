const commonMappings = require('../common/_mappings');

const eaMappings = {
  'specialist-equipment-claim': {
    showInJson: false,
  },
  'your-specialist-equipment': {
    showInJson: false,
  },
  'specialist-equipment-summary': {
    showInJson: false,
  },
  'specialist-equipment-cost': {
    showInJson: true,
    outputFieldName: 'cost',
    showSingleField: 'totalCost',
  },
  __hidden_specialist_equipment_page__: {
    showInJson: true,
    outputFieldName: 'claim',
  },
};

const mappings = Object.assign(eaMappings, commonMappings.mappings);

module.exports = {
  mappings,
};
