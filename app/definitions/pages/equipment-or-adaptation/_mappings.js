const commonMappings = require('../common/_mappings');

const eaMappings = {
  'specialist-equipment-claim': {
    showInJson: false,
    outputFieldName: 'equipmentOrAdaptationClaim',
    showSingleField: 'claimingEquipment',
  },
  'your-specialist-equipment': {
    showInJson: true,
    outputFieldName: 'claim',
    showSingleField: 'item',
  },
  'specialist-equipment-cost': {
    showInJson: true,
    outputFieldName: 'cost',
    showSingleField: 'totalCost',
  },
};

const mappings = Object.assign(eaMappings, commonMappings.mappings);

module.exports = {
  mappings,
};
