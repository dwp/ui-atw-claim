const page = require('../../../../../../app/definitions/pages/travel-to-work/total-amount-to-be-paid-towards-work-travel-costs');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('definitions/pages/travel-to-work/total-amount-to-be-paid-towards-work-travel-costs', () => {
  it('should page a function', () => {
    assert.typeOf(page, 'function');
  });
  describe('when exported function is invoked', () => {
    beforeEach(() => {
      this.result = page();
    });
    it('when exported function is invoked', () => {
      assert.typeOf(this.result, 'object');
    });

    describe('returned object keys', () => {
      describe('`view` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('view');
        });
        it('value be a string', () => {
          assert.typeOf(this.result.view, 'string');
          assert.equal(this.result.view, 'pages/travel-to-work/total-amount-to-be-paid-towards-work-travel-costs.njk');
        });
      });
      describe('`fieldValidators` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('fieldValidators');
        });

        it('value should return an object', () => {
          assert.typeOf(this.result.fieldValidators, 'object');
        });
      });
    });
  });
});
