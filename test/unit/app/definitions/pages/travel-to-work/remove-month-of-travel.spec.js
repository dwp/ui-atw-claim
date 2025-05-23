const page = require('../../../../../../app/definitions/pages/travel-to-work/remove-month-of-travel');
const sinon = require('sinon');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('definitions/pages/travel-to-work/remove-month-of-travel', () => {
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
          assert.equal(this.result.view, 'pages/travel-to-work/remove-month-of-travel.njk');
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
        it('set monthYear in title - en', () => {
          const req = new Request();
          const res = new Response(req);

          res.locals.currentUrl = '/remove-travel-month?remove=1'
          res.locals.summaryPageData = {
            '0': { monthYear: { mm: '1', yyyy: '2025' }, claim: [ [Object] ] },
            '1': { monthYear: { mm: '3', yyyy: '2024' }, claim: [ [Object] ] }
          }
          req.casa = {
            journeyContext: {
              getDataForPage: sinon.stub().returns({
                1: { monthYear: { mm: '03', yyyy: '2024'} },
              }),
              nav: { language: 'en'}
              }
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.monthYear).to.equal('March 2024');

        });

        it('set monthYear in title - cy', () => {
          const req = new Request();
          const res = new Response(req);

          res.locals.currentUrl = '/remove-travel-month?remove=1'
          res.locals.summaryPageData = {
            '0': { monthYear: { mm: '1', yyyy: '2025' }, claim: [ [Object] ] },
            '1': { monthYear: { mm: '3', yyyy: '2024' }, claim: [ [Object] ] }
          }
          req.casa = {
            journeyContext: {
              getDataForPage: sinon.stub().returns({
                1: { monthYear: { mm: '03', yyyy: '2024'} },
              }),
              nav: { language: 'cy'}
              }
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.monthYear).to.equal('Mawrth 2024');

        });

        it('set removeId from page data', () => {
          const req = new Request();
          const res = new Response(req);

          req.casa = {
            journeyContext: {
              getDataForPage: () => {
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
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-travel-month', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'journey-summary', undefined);

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
                        mm: '12',
                        yyyy: '2020',
                      },
                      claim: [{
                        dayOfTravel: '1',
                        totalTravel: '3',
                      }]
                    },
                    '1': {
                      monthYear: {
                        mm: '1',
                        yyyy: '2020',
                      },
                      claim: [{
                        dayOfTravel: '2',
                        totalTravel: '2',
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
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-travel-month', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'journey-summary', undefined);
          sinon.assert.calledWith(setDataForPageStub.thirdCall, '__hidden_travel_page__', {
            '1': {
              monthYear: {
                mm: '1',
                yyyy: '2020',
              },
              claim: [{
                dayOfTravel: '2',
                totalTravel: '2',
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
                        mm: '12',
                        yyyy: '2020',
                      },
                      claim: [{
                        dayOfTravel: '1',
                        totalTravel: '3',
                      }]
                    },
                    '1': {
                      monthYear: {
                        mm: '1',
                        yyyy: '2020',
                      },
                      claim: [{
                        dayOfTravel: '2',
                        totalTravel: '2',
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
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-travel-month', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'journey-summary', { anotherMonth: 'no' });
          sinon.assert.calledWith(setDataForPageStub.lastCall, '__hidden_travel_page__', {
            '1': {
              monthYear: {
                mm: '1',
                yyyy: '2020',
              },
              claim: [{
                dayOfTravel: '2',
                totalTravel: '2',
              }]
            }});

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

        it('user answers no in edit mode', () => {

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.inEditMode = true;

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

          req.query.remove = 0;

          this.result.hooks.postvalidate(req, res, nextStub);

          sinon.assert.calledTwice(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-travel-month', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'journey-summary', { anotherMonth: 'no' });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });
      });
    });
  });
});
