const commonMappings = require('../common/_mappings');

const twMappings = {
  'work-travel-claim': {
    showInJson: false,
  },
  'which-journey-type': {
    showInJson: true,
    showSingleField: 'howDidYouTravelForWork',
    outputFieldName: 'howDidYouTravelForWork',
    group: 'travelDetails',
  },
  'journeys-miles': {
    showInJson: true,
    showSingleField: 'journeysOrMileage',
    outputFieldName: 'journeysOrMileage',
    group: 'travelDetails',
  },
  'taxi-journeys-cost': {
    showInJson: true,
    outputFieldName: 'cost',
    showSingleField: 'totalCost',
  },
  'travel-month': {
    showInJson: false,
  },
  'travel-days': {
    showInJson: false,
  },
  'journey-summary': {
    showInJson: false,
  },
  __hidden_travel_page__: {
    showInJson: true,
    outputFieldName: 'claim',
  },
  'employment-status': {
    showInJson: true,
    outputFieldName: 'employmentStatus',
    showSingleField: 'employmentStatus',
    group: 'workplaceContact',
  },
};

const mappings = Object.assign(twMappings, commonMappings.mappings);

module.exports = {
  mappings,
};
