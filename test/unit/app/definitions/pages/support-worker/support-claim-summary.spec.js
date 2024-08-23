const page = require('../../../../../../app/definitions/pages/support-worker/support-claim-summary');
const sinon = require('sinon');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const validators = require('../../../../../../app/definitions/field-validators/support-worker/support-claim-summary');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const {
  expectValidatorToFailWithJourney, 
  expectValidatorToPassWithJourney
} = require('../../../../../helpers/validator-assertions');

let assert, expect;
(async() => {
  chai = await import ('chai');
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('definitions/pages/support-worker/support-claim-summary', () => {
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
          assert.equal(this.result.view, 'pages/support-worker/support-claim-summary.njk');
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
            'support-claim-summary',
            'anotherMonth',
            'Required',
            new JourneyContext({
              ['support-claim-summary']: {
                anotherMonth: ''
              },
              ['remove-support-month']: {
                otherField: '1'
              },
            }), {
              summary: 'support-claim-summary:required',
              inline: 'support-claim-summary:required',
            });
        });

        it('do not trigger required error when remove it clicked', async () => {
          const req = new Request();
          await expectValidatorToPassWithJourney(
            validators,
            'support-claim-summary',
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
                if (page === '__hidden_support_page__') {
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

          expect(res.locals.monthYear)
            .to
            .deep
            .equal({
              mm: '12',
              yyyy: '2020',
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
                if (page === '__hidden_support_page__') {
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
                    },
                    '1': {
                      monthYear: {
                        mm: '5',
                        yyyy: '2020',
                      },
                      claim: [{
                        'dayOfSupport': 1,
                        'timeOfSupport': {
                          'hoursOfSupport': 4,
                          'minutesOfSupport': 5
                        },
                      }]
                    },
                    '2': {
                      monthYear: {
                        mm: '1',
                        yyyy: '2019',
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
                  'dayOfSupport': 1,
                  'timeOfSupport': {
                    'hoursOfSupport': 4,
                    'minutesOfSupport': 5
                  },
                }]
              },
              '1': {
                monthYear: {
                  mm: '5',
                  yyyy: '2020',
                },
                claim: [{
                  'dayOfSupport': 1,
                  'timeOfSupport': {
                    'hoursOfSupport': 4,
                    'minutesOfSupport': 5
                  },
                }]
              },
              '2': {
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


          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('remove-month',
              { removeId: false });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
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
                if (page === '__hidden_support_page__') {
                  return {
                    '9': {
                      monthYear: {
                        mm: '12',
                        yyyy: '2020',
                      },
                      claim: [{
                        dayOfSupport: '1',
                        timeOfSupport: {
                          hoursOfSupport: 1,
                          minutesOfSupport: 30,
                        },
                        nameOfSupport: 'Name1',
                      }, {
                        dayOfSupport: '2',
                        timeOfSupport: {
                          hoursOfSupport: 2,
                          minutesOfSupport: 15,
                        },
                        nameOfSupport: 'Name2',
                      }],
                    }
                  };
                }
                if (page === 'support-month') {
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

          this
            .result.hooks.postvalidate(req, res, nextStub);

          sinon
            .assert.calledWith(setDataForPageStub.firstCall, 'remove-month', {
            removeId: false,
          });
          sinon
            .assert.calledWith(setDataForPageStub.secondCall, 'support-days', undefined);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
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
                    '9': {
                      monthYear: {
                        mm: '12',
                        yyyy: '2020',
                      },
                      claim: [{
                        dayOfSupport: '1',
                        timeOfSupport: {
                          hoursOfSupport: 1,
                          minutesOfSupport: 30,
                        },
                        nameOfSupport: 'Name1',
                      }, {
                        dayOfSupport: '2',
                        timeOfSupport: {
                          hoursOfSupport: 2,
                          minutesOfSupport: 25,
                        },
                        nameOfSupport: 'Name2',
                      }],
                    }
                  };
                }
                if (page === 'support-month') {
                  return {
                    monthIndex: '9',
                    dateOfSupport: {
                      mm: '12',
                      yyyy: '2020',
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

          sinon.assert.calledWith(setDataForPageStub.thirdCall, 'support-month-stash', {
            monthIndex: '9',
            dateOfSupport: {
              mm: '12',
              yyyy: '2020',
            },
          });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });
      });
    });
  });
})
;
