const page = require('../../../../../../app/definitions/pages/travel-to-work/total-amount-to-be-paid-towards-lift-costs');
const {
  assert,
  expect
} = require('chai');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const sinon = require('sinon');

describe('definitions/pages/travel-to-work/total-amount-to-be-paid-towards-lift-costs', () => {
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
          assert.equal(this.result.view, 'pages/travel-to-work/total-amount-to-be-paid-towards-lift-costs.njk');
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
        it('set res.locals', () => {
          const req = new Request();
          const res = new Response(req);
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: (page) => {
                if (page === '__hidden_travel_page__') {
                  return {
                    '0': {
                      monthYear: {
                        mm: '12',
                        yyyy: '2020',
                      },
                      claim: [{
                        dayOfTravel: '1',
                        totalTravel: '3',
                      }, {
                        dayOfTravel: '1',
                        totalTravel: '5',
                      }]
                    },
                    '1': {
                      monthYear: {
                        mm: '11',
                        yyyy: '2020',
                      },
                      claim: [{
                        dayOfTravel: '1',
                        totalTravel: '5',
                      }]
                    }
                  };
                } else if (page === 'month-claiming-travel-for-work') {
                  return {
                    dateOfTravel: {
                      mm: '12',
                      yyyy: '2020',
                    }
                  };
                } else if (page === 'journey-or-mileage') {
                  return {
                    journeysOrMileage: 'mileage'
                  };
                }
              }
            }
          };

          this.result.hooks.prerender(req, res, sinon.stub());
          
          expect(res.locals.travelTotal)
            .to
            .deep
            .equal(13);

          expect(res.locals.journeysOrMileage)
            .to
            .deep
            .equal('mileage');

        });
      });
    });
  });
});
