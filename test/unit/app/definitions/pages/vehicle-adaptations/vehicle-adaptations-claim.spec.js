const page = require('../../../../../../app/definitions/pages/vehicle-adaptations/vehicle-adaptations-claim')
const sinon = require('sinon');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const { claimTypesFullName } = require('../../../../../../app/config/claim-types');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('definitions/pages/vehicle-adaptations/vehicle-adaptations-claim', () => {
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
          assert.equal(this.result.view, 'pages/vehicle-adaptations/vehicle-adaptations-claim.njk');
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

      describe('prerender', () => {
        it('set __journey_type__ from page data', () => {
          const req = new Request();
          const res = new Response(req);
          const setDataForPageStub = sinon.stub();
          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('__journey_type__', { journeyType: claimTypesFullName.AV });
        });
      });
    });
  });
});
