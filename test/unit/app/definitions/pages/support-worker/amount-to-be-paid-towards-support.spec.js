const page = require('../../../../../../app/definitions/pages/support-worker/amount-to-be-paid-towards-support');
const sinon = require('sinon');
const chai = require('chai');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
chai.use(require('sinon-chai'));
const {
  assert,
  expect
} = chai;

describe('definitions/pages/support-worker/amount-to-be-paid-towards-support', () => {
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
          assert.equal(this.result.view, 'pages/support-worker/amount-to-be-paid-towards-support.njk');
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

    describe('`prerender` key', () => {
      it('should be defined', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prerender');

      });
      it('should populate initial record if there is not one present/undefined', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prerender');

        const req = new Request();
        const res = new Response(req);

        const getDataForPageStub = sinon.stub()
          .returns({ totalCost: 2211 });
        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();
        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
            setDataForPage: setDataForPageStub
          }
        };

        this.result.hooks.prerender(req, res, nextStub);

        assert.equal(res.locals.totalCost, 2211);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();

        expect(getDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('support-cost');

        sinon.assert.notCalled(setDataForPageStub);
      });
    });
  });
});
