const page = require('../../../../../../app/definitions/pages/travel-in-work/remove-month-of-tiw');
const sinon = require('sinon');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('definitions/pages/travel-in-work/remove-month-of-tiw', () => {
  it('should page a function', () => {
    assert.typeOf(page, 'function');
  });
  describe('when exported function is invoked', () => {
    let sandbox;
    beforeEach(() => {
      this.result = page();
      sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();
    });

    afterEach(() => {
      sandbox.restore();
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
          assert.equal(this.result.view, 'pages/travel-in-work/remove-month-of-tiw.njk');
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
        it('set removeId from page data', () => {
          const req = new Request();
          const res = new Response(req);

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === '__hidden_travel_page__') {
                  return {
                    '0': {
                      monthYear: {
                        mm: '12',
                        yyyy: '2020',
                      },
                      claim: [{
                        'dayOfSupport': 1,
                        'timeOfSupport': {
                          'hoursOfSupport': 4,
                          'minutesOfSupport': 5
                        },
                      }]
                    }
                  };
                } else {
                }
                return {
                  removeId: '1'
                };
            }
            }
          };

          req.query.remove = 0;

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.removeId)
            .to
            .equal(0);
        });

      });

      describe('postvalidate', () => {
        it('user answers no just continue', () => {
          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: () => {
                return {
                  removeMonthOfTravel: 'no'
                };
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, nextStub);

          sinon.assert.calledTwice(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-tiw-month', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'taxi-journeys-summary', undefined);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

        it('user answers yes and continue', () => {
          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.session = {
            save: sinon.stub()
              .callsFake((cb) => {
                if (cb) {
                  cb();
                }
              }),
          };

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === '__hidden_travel_page__') {
                  return {
                    '0': {
                      monthYear: {
                        mm: '1',
                        yyyy: '2024',
                      },
                      claim: [{dayOfTravel: 1,
                        startPostcode: 'a',
                        endPostcode: 'b',
                        costOfTravel: '1'
                      }]
                    },
                    '1': {
                      monthYear: {
                        mm: '2',
                        yyyy: '2024',
                      },
                      claim: [{dayOfTravel: 2,
                        startPostcode: 'b',
                        endPostcode: 'b',
                        costOfTravel: '2'
                      }]
                    }
                  };
                }
                return {
                  removeId: '0',
                  removeMonthOfTravel: 'yes'
                };
              },
              setDataForPage: setDataForPageStub
            }
          };

          req.query.remove = 0;

          this.result.hooks.postvalidate(req, res, nextStub);

          sinon.assert.calledThrice(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-tiw-month', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'taxi-journeys-summary', undefined);
          sinon.assert.calledWith(setDataForPageStub.thirdCall, '__hidden_travel_page__', {
            '1': {
              monthYear: {
                mm: '2',
                yyyy: '2024',
              },
              claim: [{dayOfTravel: 2,
                startPostcode: 'b',
                endPostcode: 'b',
                costOfTravel: '2'
              }]
            }
          });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

        it('user answers yes and continue in edit mode', () => {

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.inEditMode = true;

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === 'taxi-journeys-summary') {
                  let taxiJourneySummary = { anotherMonth: 'no' };
                  return taxiJourneySummary;
                } else if (page == '__hidden_travel_page__') {
                  return {
                    '0': {
                      monthYear: {
                        mm: '1',
                        yyyy: '2024',
                      },
                      claim: [{
                        dayOfTravel: 1,
                        startPostcode: 'a',
                        endPostcode: 'b',
                        costOfTravel: '1'
                      }]
                    },
                    '1': {
                      monthYear: {
                        mm: '2',
                        yyyy: '2024',
                      },
                      claim: [{
                        dayOfTravel: 2,
                        startPostcode: 'b',
                        endPostcode: 'b',
                        costOfTravel: '2'
                      }]
                    }
                  };
                } else {
                return {
                  removeMonthOfTravel: 'yes'
                };
              }
              },
              setDataForPage: setDataForPageStub
            }
          };

          req.query.remove = 0;

          this.result.hooks.postvalidate(req, res, nextStub);

          sinon.assert.calledThrice(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-tiw-month', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'taxi-journeys-summary', { anotherMonth: 'no' });
          sinon.assert.calledWith(setDataForPageStub.lastCall, '__hidden_travel_page__', {
            '1': {
              monthYear: {
                mm: '2',
                yyyy: '2024',
              },
              claim: [{
                dayOfTravel: 2,
                startPostcode: 'b',
                endPostcode: 'b',
                costOfTravel: '2'
              }]
            }});

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });
      });
    });
  });
});
