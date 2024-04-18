const commonMappings = require('../common/_mappings');

const tiwMappings = {
  'during-work-travel-claim': {
    showInJson: false,
  },
  'travel-claim-month': {
    showInJson: false,
  },
  'travel-claim-days': {
    showInJson: false,
  },
  'total-cost': {
    showInJson: true,
    outputFieldName: 'cost',
  },
  'taxi-journeys-summary': {
    showInJson: false,
  },
  __hidden_travel_page__: {
    showInJson: true,
    outputFieldName: 'claim',
  },
  'total-mileage': {
    showInJson: true,
    outputFieldName: 'totalMileage',
    showSingleField: 'totalMileage',
  },
  'employment-status': {
    showInJson: true,
    outputFieldName: 'employmentStatus',
    showSingleField: 'employmentStatus',
    group: 'workplaceContact',
  },
};

const mappings = Object.assign(tiwMappings, commonMappings.mappings);

module.exports = {
  mappings,
};
