const page = require('../../../../../../app/definitions/pages/vehicle-adaptations/total-vehicle-adaptations-cost');
const chai = require('chai');
const {
  assert,
  expect
} = chai;
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');

describe('definitions/pages/vehicle-adaptations/total-vehicle-adaptations-cost', () => {
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
          assert.equal(this.result.view, 'pages/vehicle-adaptations/total-vehicle-adaptations-cost.njk');
        });
      });
      describe('`fieldValidators` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('fieldValidators');
        });
      });

      describe('`prerender` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          const getDataForPageStub = sinon.stub()
            .returns({
              totalCost: '1001'
            });
          req.casa = {
            journeyContext: {
              getDataForPage: getDataForPageStub
            }
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          expect(res.locals.totalCost)
            .to
            .deep
            .equal( '1001');
        });
      });
    });
  });
});
