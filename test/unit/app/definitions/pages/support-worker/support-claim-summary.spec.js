const page = require('../../../../../../app/definitions/pages/support-worker/support-claim-summary');
const sinon = require('sinon');
const chai = require('chai');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
chai.use(require('sinon-chai'));
const {
  assert,
  expect
} = chai;
const {
  expectValidatorToFailWithJourney,
  expectValidatorToPassWithJourney,
} = require('../../../../../helpers/validator-assertions');
const validators = require('../../../../../../app/definitions/field-validators/support-worker/support-claim-summary');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

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
              ['remove-month-of-support']: {
                otherField: '1'
              },
            }), {
              summary: 'support-claim-summary:required',
              inline: 'support-claim-summary:required',
            });
        });

        it('do not trigger required error when remove it clicked', async () => {
          await expectValidatorToPassWithJourney(
            validators,
            'support-claim-summary',
            'anotherMonth',
            'Required',
            new JourneyContext({
              ['remove-month-of-support']: {
                removeId: '1'
              },
            }));
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


          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('remove-month-of-support', undefined);

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
      });

      describe('`prevalidate` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prevalidate');
        });

        it('go to next if remove not defined', () => {
          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          this.result.hooks.prevalidate(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

        it('populate remove page with removeId if remove in req body', () => {
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

          req.body = {
            remove: '9'
          };

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.prevalidate(req, res, nextStub);

          sinon.assert.calledOnce(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-month-of-support', {
            removeId: '9',
          });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
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

          sinon.assert.notCalled(setDataForPageStub);

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
                if (page === 'month-claiming-support-worker-costs') {
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
            .assert.calledThrice(setDataForPageStub);
          sinon
            .assert.calledWith(setDataForPageStub.firstCall, 'days-you-had-support', undefined);
          sinon
            .assert.calledWith(setDataForPageStub.thirdCall, 'month-claiming-support-worker-costs', {
            monthIndex: '10',
          });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

        it('should back up month-claiming-support-worker-costs state if user want to add another month', () => {
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
                if (page === 'month-claiming-support-worker-costs') {
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

          sinon.assert.calledWith(setDataForPageStub.secondCall, 'month-claiming-support-worker-costs-stash', {
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
