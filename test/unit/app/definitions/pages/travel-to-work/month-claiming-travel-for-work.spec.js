const page = require('../../../../../../app/definitions/pages/travel-to-work/month-claiming-travel-for-work');
const {
  assert,
  expect
} = require('chai');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const sinon = require('sinon');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const removeAllSpaces = require('../../../../../../app/utils/remove-all-spaces.js');

describe('definitions/pages/travel-to-work/month-claiming-travel-for-work', () => {
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
          assert.equal(
            this.result.view,
            'pages/travel-to-work/month-claiming-travel-for-work.njk'
          );
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
        beforeEach(() => {
          this.result = page();
        });
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');
        });

        it("set journeyPreviousUrl if anotherMonth is yes", () => {
          const req = new Request();
          const res = new Response(req);

          req.casa = {
            journeyContext: {
              getDataForPage: () => {
                return {
                  anotherMonth: "yes",
                };
              },
            },
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.casa.journeyPreviousUrl).to.equal("/claim/travel-to-work/journey-summary");
        });

        it('set monthIndex to value from page', () => {
          const req = new Request();
          const res = new Response(req);

          req.casa = {
            journeyContext: {
              getDataForPage: () => {
                return {
                  monthIndex: '1',
                };
              },
            },
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.monthIndex)
            .to
            .equal('1');
        });

        it('set monthIndex to 0 if no page data', () => {
          const req = new Request();
          const res = new Response(req);

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === 'how-did-you-travel-for-work') {
                  return {
                    howDidYouTravelForWork: 'taxi'
                  };
                }

                return undefined;
              },
            },
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.monthIndex)
            .to
            .equal('0');
          expect(res.locals.howDidYouTravelForWork)
            .to
            .equal('taxi');
        });

        it('change mode set', () => {
          const req = new Request();
          const res = new Response(req);

          req.query = {
            changeMonthYear: '0',
          };

          const sandbox = sinon.createSandbox();
          sandbox.stub(JourneyContext, 'putContext').callsFake();

          req.session = {
            save: sinon.stub()
              .callsFake((cb) => {
                if (cb) {
                  cb();
                }
              }),
          };

          const pageData = {
            0: {
              monthYear: {
                mm: '12',
                yyyy: '2020',
              },
              claim: [
                {
                  dayOfTravel: '1',
                  totalTravel: '1',
                }, {
                  dayOfTravel: '2',
                  totalTravel: '2',
                },
              ],
            },
          };

          const setDataForPageStub = sinon.stub();
          const nextStub = sinon.stub();
          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === 'how-did-you-travel-for-work') {
                  return {
                    howDidYouTravelForWork: 'lift'
                  };
                } else if (page === '__hidden_travel_page__') {
                  return pageData;
                } else {
                  return {
                    mm: '12',
                    yyyy: '2020',
                  };
                }
              },
              setDataForPage: setDataForPageStub,
            },
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          expect(res.locals.howDidYouTravelForWork)
            .to
            .equal('lift');

          sinon.assert.calledTwice(setDataForPageStub);
          sinon.assert.calledWith(
            setDataForPageStub.firstCall,
            'month-claiming-travel-for-work',
            {
              monthIndex: '0',
              dateOfTravel: {
                mm: '12',
                yyyy: '2020',
              },
            }
          );
          sinon.assert.calledWith(
            setDataForPageStub.secondCall,
            'days-you-travelled-for-work',
            {
              day: [
                {
                  dayOfTravel: '1',
                  totalTravel: '1',
                }, {
                  dayOfTravel: '2',
                  totalTravel: '2',
                },
              ],
            }
          );

          sandbox.restore();
        });

        it('Change mode set to undefined', () => {
          const req = new Request();
          const res = new Response(req);

          req.query = {};

          const setDataForPageStub = sinon.stub();
          const nextStub = sinon.stub();
          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: (page) => {
                if (page === 'how-did-you-travel-for-work') {
                  return {
                    howDidYouTravelForWork: 'taxi'
                  };
                }
              }
            }
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(req.query.changeMonthYear)
            .to
            .be
            .equal(undefined);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          sinon.assert.notCalled(setDataForPageStub);

        });

        it('Adding new month in edit mode', () => {
          const req = new Request();
          const res = new Response(req);

          const setDataForPageStub = sinon.stub();
          const nextStub = sinon.stub();

          req.session = {
            save: sinon.stub()
              .callsFake((cb) => {
                if (cb) {
                  cb();
                }
              }),
          };

          req.inEditMode = true;

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: (page) => {
                if (page === 'how-did-you-travel-for-work') {
                  return {
                    howDidYouTravelForWork: 'taxi'
                  };
                } else if (page === '__hidden_travel_page__') {
                  return {
                    '0': {
                      monthYear: {
                        mm: '12',
                        yyyy: '2020',
                      },
                      claim: [{
                        dayOfTravel: '1',
                        totalTravel: '1',
                      }]
                    },
                    '9': {
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
              }
            }
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          assert.equal(res.locals.monthIndex, 10);
          sinon.assert.notCalled(setDataForPageStub);

        });

        it('Set month index to 0 when in edit mode and no data in hidden_travel_page', () => {
          const req = new Request();
          const res = new Response(req);

          const setDataForPageStub = sinon.stub();
          const nextStub = sinon.stub();

          req.session = {
            save: sinon.stub()
              .callsFake((cb) => {
                if (cb) {
                  cb();
                }
              }),
          };

          req.inEditMode = true;

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: (page) => {
                if (page === 'how-did-you-travel-for-work') {
                  return {
                    howDidYouTravelForWork: 'taxi'
                  };
                } else if (page === '__hidden_travel_page__') {
                  return undefined
                }
              }
            }
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          assert.equal(res.locals.monthIndex, 0);
          sinon.assert.notCalled(setDataForPageStub);

        });
      });

      describe('`preredirect`', () => {
        beforeEach(() => {
          this.result = page();
        });
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('preredirect');
        });

        it("if user wants to add entry for month that already has an entry", () => {
          const req = new Request();
          const res = new Response(req);

          const nextStub = sinon.stub();

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
                        totalTravel: '1',
                      }]
                    },
                    '9': {
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
              }
            },
          };

          req.body = {
            dateOfTravel : {
              mm: '01',
              yyyy: '2020'
            }
          }

          this.result.hooks.preredirect(req, res, nextStub);

          sinon.assert.notCalled(nextStub);

          expect(res.redirectedTo)
            .to
            .be
            .equal('days-you-travelled-for-work?changeMonthYear=9');
        });

        it('if in edit mode', () => {
          const req = new Request();
          const res = new Response(req);

          const sandbox = sinon.createSandbox();
          sandbox.stub(JourneyContext, 'putContext').callsFake();

          const setDataForPageStub = sinon.stub();
          const nextStub = sinon.stub();

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: () => {}
            },
          };

          req.inEditMode = true;

          this.result.hooks.preredirect(req, res, nextStub);

          sinon.assert.calledTwice(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'days-you-travelled-for-work', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'journey-summary', undefined);
          sandbox.restore();
        });

        it('if not in edit mode', () => {
          const req = new Request();
          const res = new Response(req);

          const nextStub = sinon.stub();

          req.session = {
            save: sinon.stub()
              .callsFake((cb) => {
                if (cb) {
                  cb();
                }
              }),
          };

          req.inEditMode = false;

          this.result.hooks.preredirect(req, res, nextStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

        });

      });

      describe('Utils: removeAllSpaces', () => {
        it('should export a function', () => {
          expect(removeAllSpaces)
              .to
              .be
              .a('function');
        });

        it('should strip spaces from a string', () => {
          expect(Object.keys(this.result))
              .to
              .includes('hooks');
          expect(Object.keys(this.result.hooks))
              .to
              .includes('pregather');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          req.body.dateOfTravel = {
            mm: ' 1 ',
            yyyy: ' 2023'
          }

          this.result.hooks.pregather(req, res, nextStub);

          expect(req.body.dateOfTravel.mm)
              .to
              .equal('1');
          expect(req.body.dateOfTravel.yyyy)
              .to
              .equal('2023');
        });
      });
    });
  });
});
