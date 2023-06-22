const {
  assert
} = require('chai');
const journeys = require('../../../../app/definitions/journeys.js');

describe('definitions/journeys.js', () => {
  it('when exported function is invoked', () => {
    assert.typeOf(journeys, 'function');
  });
  it('when exported function is invoked', () => {
    assert.typeOf(journeys(), 'object');
  });
});
