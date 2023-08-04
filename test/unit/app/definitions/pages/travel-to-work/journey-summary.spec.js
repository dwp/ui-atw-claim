const page = require('../../../../../../app/definitions/pages/travel-to-work/journey-summary');
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
const validators = require('../../../../../../app/definitions/field-validators/travel-to-work/journey-summary');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

describe('definitions/pages/travel-to-work/journey-summary', () => {
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
          assert.equal(this.result.view, 'pages/travel-to-work/journey-summary.njk');
        });
      });
      describe('`fieldValidators` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('fieldValidators');
        });

        it('trigger required error when continue clicked ', async () => {
          await expectValidatorToFailWithJourney(
            validators,
            'journey-summary',
            'anotherMonth',
            'Required',
            new JourneyContext({
              ['journey-summary']: {
                anotherMonth: ''
              },
              ['remove-travel-month']: {
                otherField: '1'
              },
            }), {
              summary: 'journey-summary:errors.journeys.required',
              inline: 'journey-summary:errors.journeys.required',
            });
        });

        it('trigger required error when continue clicked - mileage', async () => {
          await expectValidatorToFailWithJourney(
            validators,
            'journey-summary',
            'anotherMonth',
            'Required',
            new JourneyContext({
              ['journey-summary']: {
                anotherMonth: ''
              },
              ['journeys-miles']: {
                journeysOrMileage: 'mileage'
              },
              ['remove-travel-month']: {
                otherField: '1'
              },
            }), {
              summary: 'journey-summary:errors.mileage.required',
              inline: 'journey-summary:errors.mileage.required',
            });
        });

        it('trigger required error when continue clicked - journeys', async () => {
          await expectValidatorToFailWithJourney(
            validators,
            'journey-summary',
            'anotherMonth',
            'Required',
            new JourneyContext({
              ['journey-summary']: {
                anotherMonth: ''
              },
              ['journeys-miles']: {
                journeysOrMileage: 'journeys'
              },
              ['remove-travel-month']: {
                otherField: '1'
              },
            }), {
              summary: 'journey-summary:errors.journeys.required',
              inline: 'journey-summary:errors.journeys.required',
            });
        });

        it('do not trigger required error when remove it clicked', async () => {
          await expectValidatorToPassWithJourney(
            validators,
            'journey-summary',
            'anotherMonth',
            'Required',
            new JourneyContext({
              ['remove-travel-month']: {
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
                if (page === '__hidden_travel_page__') {
                  return {
                    '0': {
                      monthYear: {
                        mm: '12',
                        yyyy: '2020',
                      },
                      claim: [{
                        dayOfTravel: '01',
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
                        dayOfTravel: '019',
                        totalTravel: '5',
                      }]
                    }
                  };
                } else if (page === 'travel-month') {
                  return {
                    dateOfTravel: {
                      mm: '12',
                      yyyy: '2020',
                    }
                  };
                } else if (page === 'journeys-miles') {
                  return {
                    journeysOrMileage: 'mileage'
                  };
                } else if (page === 'which-journey-type') {
                  return {
                    howDidYouTravelForWork: 'taxi'
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
            .calledOnceWithExactly('remove-travel-month', undefined);

          expect(res.locals.travelTotal)
            .to
            .deep
            .equal(13);

            expect(res.locals.howDidYouTravelForWork)
            .to
            .deep
            .equal('taxi');

          expect(res.locals.journeysOrMileage)
            .to
            .deep
            .equal('mileage');

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
                  dayOfTravel: 1,
                  totalTravel: 3,
                }, {
                  dayOfTravel: 1,
                  totalTravel: 5,
                }]
              },
              '1': {
                monthYear: {
                  mm: '11',
                  yyyy: '2020',
                },
                claim: [{
                  dayOfTravel: 19,
                  totalTravel: 5,
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
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'remove-travel-month', {
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
                if (page === '__hidden_travel_page__') {
                  return {
                    '9': {
                      monthYear: {
                        mm: '12',
                        yyyy: '2020',
                      },
                      claim: [{
                        dayOfTravel: '1',
                        totalTravel: '1',
                      }, {
                        dayOfTravel: '2',
                        totalTravel: '2',
                      }],
                    }
                  };
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
            .assert.calledWith(setDataForPageStub.firstCall, 'travel-days', undefined);
          sinon
            .assert.calledWith(setDataForPageStub.thirdCall, 'travel-month', {
            monthIndex: '10',
          });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });

        it('should back up month-claiming-travel-for-work state if user want to add another month', () => {
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
                    '9': {
                      monthYear: {
                        mm: '12',
                        yyyy: '2020',
                      },
                      claim: [{
                        dayOfTravel: '1',
                        totalTravel: '1',
                      }, {
                        dayOfTravel: '2',
                        totalTravel: '2',
                      }],
                    }
                  };
                }
                if (page === 'travel-month') {
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

          sinon.assert.calledWith(setDataForPageStub.secondCall, 'travel-month-stash', {
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
