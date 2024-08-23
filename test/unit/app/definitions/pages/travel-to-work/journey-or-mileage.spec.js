const page = require('../../../../../../app/definitions/pages/travel-to-work/journey-or-mileage');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');

const sinon = require('sinon');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
})();

describe('definitions/pages/travel-to-work/journey-or-mileage', () => {
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
          assert.equal(this.result.view, 'pages/travel-to-work/journey-or-mileage.njk');
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
      describe('postvalidate', () => {
        it('do not clear journey data if same answer given', () => {
          const req = new Request();
          const res = new Response(req);
          const setDataForPageStub = sinon.stub();
          const setValidationErrorsForPageStub = sinon.stub();
          req.casa = {
            journeyContext: {
              getDataForPage: () => {
                return {
                  journeysOrMileage: 'journey'
                };
              },
              setDataForPage: setDataForPageStub,
              setValidationErrorsForPage: setValidationErrorsForPageStub
            }
          };
  
          this.result.hooks.postvalidate(req, res, sinon.stub());
  
          sinon.assert.callCount(setDataForPageStub, 0);
          sinon.assert.callCount(setValidationErrorsForPageStub, 0);
        });
        it('sets month-claiming-travel-for-work and days-you-travelled-for-work to undefined if different answer given', () => {
          const req = new Request();
          const res = new Response(req);
          const setDataForPageStub = sinon.stub();
          const setValidationErrorsForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === 'journeys-miles') {
                  return {
                    journeysOrMileage: 'mileage'
                  };
                }
              },
              setDataForPage: setDataForPageStub,
              setValidationErrorsForPage: setValidationErrorsForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, sinon.stub());

          sinon.assert.callCount(setValidationErrorsForPageStub, 2);
          sinon.assert.calledWith(setValidationErrorsForPageStub.getCall(0), 'travel-month');
          sinon.assert.calledWith(setValidationErrorsForPageStub.getCall(1), 'travel-days');

          sinon.assert.callCount(setDataForPageStub, 4);
          sinon.assert.calledWith(setDataForPageStub.getCall(0), 'travel-month', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(1), 'travel-days', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(2), '__hidden_travel_page__', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(3), '__hidden_journey_or_mileage__', { journeysOrMileage: 'mileage' });

        });
      });
    });
  });
});
