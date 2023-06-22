const commonMappings = require('../common/_mappings');

const twMappings = {
  'work-travel-claim': {
    showInJson: false,
  },
  'how-did-you-travel-for-work': {
    showInJson: true,
    showSingleField: 'howDidYouTravelForWork',
    outputFieldName: 'howDidYouTravelForWork',
    group: 'travelDetails',
  },
  'journey-or-mileage': {
    showInJson: true,
    showSingleField: 'journeysOrMileage',
    outputFieldName: 'journeysOrMileage',
    group: 'travelDetails',
  },
  'cost-of-taxi-journeys': {
    showInJson: true,
    outputFieldName: 'cost',
    showSingleField: 'totalCost',
  },
  'month-claiming-travel-for-work': {
    showInJson: false,
  },
  'days-you-travelled-for-work': {
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
