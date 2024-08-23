const page = require("../../../../../../app/definitions/pages/travel-in-work/taxi-journeys-summary");
const Request = require("../../../../../helpers/fakeRequest");
const Response = require("../../../../../helpers/fakeResponse");
const sinon = require('sinon');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const validators = require('../../../../../../app/definitions/field-validators/travel-in-work/taxi-journeys-summary');
const {
  expectValidatorToFailWithJourney, 
  expectValidatorToPassWithJourney
} = require('../../../../../helpers/validator-assertions');

let assert;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
})();

describe('definitions/pages/travel-in-work/taxi-journeys-summary', () => {
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
          assert.equal(this.result.view, 'pages/travel-in-work/taxi-journeys-summary.njk');
        });
      });
      describe('`fieldValidators` key', () => {

        it('should be defined', () => {
          expect(Object.keys(this.result))
              .to
              .includes('fieldValidators');
        });

        it('trigger required error when continue clicked', async () => {
          await expectValidatorToFailWithJourney(
              validators,
              'taxi-journey-summary',
              'anotherMonth',
              'Required',
              new JourneyContext({
                ['taxi-journeys-summary']: {
                  anotherMonth: ''
                },
                ['remove-support-month']: {
                  otherField: '1'
                },
              }), {
                summary: 'taxi-journeys-summary:required',
                inline: 'taxi-journeys-summary:required',
              });
        });

        it('do not trigger required error when remove it clicked', async () => {
          const req = new Request();
          await expectValidatorToPassWithJourney(
              validators,
              'taxi-journeys-summary',
              'anotherMonth',
              'Required',
              req.query = {
                removeId: '0',
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
                        mm: '1',
                        yyyy: '2024',
                      },
                      claim: [{
                        '0': {dayOfTravel: 1,
                          startPostcode: 'a',
                          endPostcode: 'b',
                          costOfTravel: '1'}
                      }]
                    }
                  };
                } else {
                  return {
                      mm: '1',
                      yyyy: '2024',

                  };
                }
              }
            }
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.travelMonth)
              .to
              .deep
              .equal({
                mm: '1',
                yyyy: '2024',
              });

          sinon.assert.calledWith(setDataForPageStub.secondCall, 'remove-month', {
            removeId: true,
          });

          expect(res.locals.allData)
              .to
              .deep
              .equal({
                '0': {
                  monthYear: {
                    mm: '1',
                    yyyy: '2024',
                  },
                  claim: [{
                      '0': {dayOfTravel: 1,
                        startPostcode: 'a',
                        endPostcode: 'b',
                        costOfTravel: '1'}
                  }]
                }
              });
        });
        it('should display dates in chronological', () => {
          expect(Object.keys(this.result))
              .to
              .includes('hooks');
          expect(Object.keys(this.result.hooks))
              .to
              .includes('prerender');

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
                        mm: '1',
                        yyyy: '2024',
                      },
                      claim: [{
                        '0': {dayOfTravel: 1,
                          startPostcode: 'a',
                          endPostcode: 'b',
                          costOfTravel: '1'}
                      }]
                    },
                    '1': {
                      monthYear: {
                        mm: '2',
                        yyyy: '2024',
                      },
                      claim: [{
                        '0': {dayOfTravel: 2,
                          startPostcode: 'c',
                          endPostcode: 'd',
                          costOfTravel: '2'}
                      }]
                    },
                    '2': {
                      monthYear: {
                        mm: '1',
                        yyyy: '2019',
                      },
                      claim: [{
                        '0': {dayOfTravel: 3,
                          startPostcode: 'e',
                          endPostcode: 'f',
                          costOfTravel: '3'}
                      }]
                    }
                  };
                } else {
                  return {
                    dateOfSupport: {
                      mm: '12',
                      yyyy: '2020',
                    }
                  };
                }
              }
            }
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.allData)
              .to
              .deep
              .equal({
                '0': {
                  monthYear: {
                    mm: '1',
                    yyyy: '2019',
                  },
                  claim: [{
                    '0': {dayOfTravel: 3,
                      startPostcode: 'e',
                      endPostcode: 'f',
                      costOfTravel: '3'}
                  }]
                },
                '1': {
                  monthYear: {
                    mm: '1',
                    yyyy: '2024',
                  },
                  claim: [{
                    '0': {dayOfTravel: 1,
                      startPostcode: 'a',
                      endPostcode: 'b',
                      costOfTravel: '1'}
                  }]
                },
                '2': {
                  monthYear: {
                    mm: '2',
                    yyyy: '2024',
                  },
                  claim: [{
                    '0': {dayOfTravel: 2,
                      startPostcode: 'c',
                      endPostcode: 'd',
                      costOfTravel: '2'}
                  }]
                }
              });
        });
      });

      describe('`postvalidate` key', () => {

        it('should be defined', () => {
          expect(Object.keys(this.result))
              .to
              .includes('hooks');
          expect(Object.keys(this.result.hooks))
              .to
              .includes('postvalidate');
        });

        it('do no data changes if answer was not yes', () => {
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
              getDataForPage: () => {
                return {
                  anotherMonth: 'no'
                };
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, nextStub);

          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-month', { removeId: false });

        });

        it('setup date if user want to add another month', () => {
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
                      claim: [{
                        '0': {dayOfTravel: 1,
                          startPostcode: 'a',
                          endPostcode: 'b',
                          costOfTravel: '1'}
                      }]
                    }
                  };
                }
                if (page === 'travel-claim-month') {
                  return {
                    some: 'data'
                  }
                }
                return {
                  anotherMonth: 'yes'
                };
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, nextStub);

          sinon.assert.calledWith(setDataForPageStub.getCall(0), 'remove-month', {
            removeId: false,
          });
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'travel-claim-days', undefined);

        });

        it('should back up support-month state if user want to add another month', () => {
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
                if (page === '__hidden_support_page__') {
                  return {
                    '0': {
                      monthYear: {
                        mm: '1',
                        yyyy: '2024',
                      },
                      claim: [{
                        '0': {dayOfTravel: 1,
                          startPostcode: 'a',
                          endPostcode: 'b',
                          costOfTravel: '1'}
                      }]
                    }
                  };
                }
                if (page === 'travel-claim-month') {
                  return {
                    monthIndex: '0',
                    dateOfSupport: {
                      mm: '1',
                      yyyy: '2024',
                    },
                  }
                }
                return {
                  anotherMonth: 'yes'
                };
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, nextStub);

          sinon.assert.calledWith(setDataForPageStub.thirdCall, 'travel-claim-month-stash', {
            monthIndex: '0',
            dateOfSupport: {
              mm: '1',
              yyyy: '2024',
            },
          });

        });
      });
    });
  });
})
;
