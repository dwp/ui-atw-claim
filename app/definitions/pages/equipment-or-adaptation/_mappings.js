const commonMappings = require('../common/_mappings');

const eaMappings = {
  'equipment-or-adaptation-claim': {
    showInJson: false,
    outputFieldName: 'equipmentOrAdaptationClaim',
    showSingleField: 'claimingEquipment',
  },
  'your-equipment-or-adaptation': {
    showInJson: true,
    outputFieldName: 'claim',
    showSingleField: 'item',
  },
  'equipment-or-adaptation-cost': {
    showInJson: true,
    outputFieldName: 'cost',
    showSingleField: 'totalCost',
  },
};

const mappings = Object.assign(eaMappings, commonMappings.mappings);

module.exports = {
  mappings,
};
