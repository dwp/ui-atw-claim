const sinon = require('sinon');
const { claimTypesFullName } = require('../../app/config/claim-types');

const DEFAULT_CONTEXT_ID = 'default';

const map = () => ({
  guid: null,
  traverse: sinon.stub().returns([]),
  containsWaypoint: sinon.stub().returns(false),
});
const getDataForPage = (pageName) => {
  if (pageName === '__journey_type__') {
    return {
      journeyType: claimTypesFullName.EA,
    };
  }
  if (pageName === '__hidden_account__') {
    return {
      account: {
        payees: [],
      },
    };
  }
  return undefined
}

const data = () => ({
  getData: sinon.stub().returns({}),
  getDataForPage,
  getValidationErrors: sinon.stub().returns({}),
  getValidationErrorsForPage: sinon.stub().returns({}),
  clearValidationErrorsForPage: sinon.stub(),
  setDataForPage: sinon.stub(),
  setValidationErrorsForPage: sinon.stub(),
  toObject: sinon.stub().returns({}),
  fromObject: sinon.stub().callsFake(() => data()),
  isDefault: sinon.stub().returns(true),
  identity: { id: DEFAULT_CONTEXT_ID },
});

data.putContext = sinon.stub().returns();

const plan = () => ({
  containsWaypoint: sinon.stub().returns(false),
  traverse: sinon.stub().returns([]),
  traverseNextRoutes: sinon.stub().returns([]),
  traversePrevRoutes: sinon.stub().returns([]),
  getOrigins: sinon.stub().returns([]),
  getPrevOutwardRoutes: sinon.stub().returns([]),
});

module.exports = {
  map,
  data,
  plan,
};
