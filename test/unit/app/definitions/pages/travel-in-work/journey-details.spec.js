const page = require("../../../../../../app/definitions/pages/travel-in-work/journey-details");
const Request = require("../../../../../helpers/fakeRequest");
const Response = require("../../../../../helpers/fakeResponse");
const sinon = require("sinon");
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const { removeAllSpaces } = require('../../../../../../app/utils/remove-all-spaces.js');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
})();

describe("definitions/pages/travel-in-work/journey-details", () => {
  it("should page a function", () => {
    assert.typeOf(page, "function");
  });
  describe("when exported function is invoked", () => {
    beforeEach(() => {
      this.result = page();
    });
    it("when exported function is invoked", () => {
      assert.typeOf(this.result, "object");
    });

    describe("returned object keys", () => {
      describe("`view` key", () => {
        it("should be defined", () => {
          expect(Object.keys(this.result)).to.includes("view");
        });
        it("value be a string", () => {
          assert.typeOf(this.result.view, "string");
          assert.equal(
            this.result.view,
            "pages/travel-in-work/journey-details.njk"
          );
        });
      });
      describe("`fieldValidators` key", () => {
        it("should be defined", () => {
          expect(Object.keys(this.result)).to.includes("fieldValidators");
        });

        it("value should return an object", () => {
          assert.typeOf(this.result.fieldValidators, "object");
        });
      });

      describe("prerender", () => {
        beforeEach(() => {
          this.result = page();
        });
        it("should be defined", () => {
          expect(Object.keys(this.result)).to.includes("hooks");
          expect(Object.keys(this.result.hooks)).to.includes("prerender");
        });

        it('First time entering journey details for TIW',
          () => {
            expect(Object.keys(this.result))
              .to
              .includes('hooks');
            expect(Object.keys(this.result.hooks))
              .to
              .includes('prerender');

            const req = new Request();
            const res = new Response(req);
            req.headers.referer = '/claims/page';

            const setDataForPageStub = sinon.stub();
            const nextStub = sinon.stub();
            req.casa = {
              journeyContext: {
                getDataForPage: (page) => {
                  if (page === 'travel-claim-days') {
                    let days =
                      [{
                        "indexDay": 1,
                        "journeyNumber": 1
                      }];
                    return days;
                  } else if (page === 'travel-claim-month') {
                    return {
                      'monthIndex': '0',
                      'dateOfTravel': {
                        'mm': '1',
                        'yyyy': '2024'
                      }
                    };
                  }
                  return undefined;
                },
                setDataForPage: setDataForPageStub
              }
            };

            res.locals.days = [{"indexDay": 1, "journeyNumber": 1}];

            this.result.hooks.prerender(req, res, nextStub);

            expect(res.locals.weekDays)
              .to
              .deep
              .equal([{
                "day": 1,
                "weekday": 1,
                "month": '1'
              }]);
          });

        it('Change from summary screen not CYA', () => {
          expect(Object.keys(this.result))
              .to
              .includes('hooks');
          expect(Object.keys(this.result.hooks))
              .to
              .includes('prerender');

          const req = new Request();
          const res = new Response(req);
          req.headers.referer = "changeMonthYear?0";

          const setDataForPageStub = sinon.stub();
          const nextStub = sinon.stub();
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
                        dayOfTravel: 1,
                          startPostcode: 'a',
                          endPostcode: 'b',
                          costOfTravel: '1'
                      }]
                    }
                  }
                }
                if (page === 'travel-claim-month') {
                  return {
                    monthIndex: "0",
                    dateOfTravel: {
                      mm: "1",
                      yyyy: "2024"
                    }
                  };
                } else if (page === 'travel-claim-days') {
                  let daysOfTravel = [{indexDay: 1, journeyNumber: 1}];
                  return daysOfTravel;
                }
                return undefined;
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(res.locals.days).to
              .deep.equal([{ indexDay: 1, journeyNumber: 1 }]
          );

          expect(res.locals.monthYearOfSupport).to
              .deep
              .equal ({
                mm: "1",
                yyyy: "2024"
              });

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
          const setDataForPageStub = sinon.stub();
          const nextStub = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
               if (page === 'travel-claim-days') {
                   let days =
                     [{
                       "indexDay": 1,
                       "journeyNumber": 1
                     }];
                   return days;
                }
                return undefined;
              },
              setDataForPage: setDataForPageStub
            }
          };
          req.body.journeyDetails = {
              '0': {
                  '0': {
                    startPostcode: 'XX1 YY 1',
                    endPostcode: 'Y Y1 Z Z 1',
                    totalCost: '1 0'
                    }
                }
            };

          this.result.hooks.pregather(req, res, nextStub);

          expect(req.body.journeyDetails[0][0].startPostcode)
            .to
            .equal('XX1YY1');

          expect(req.body.journeyDetails[0][0].endPostcode)
            .to
            .equal('YY1ZZ1');

          expect(req.body.journeyDetails[0][0].totalCost)
            .to
            .equal('10.00');

        });
      });

      describe('`postvalidate` key', () => {
        let sandbox;
        beforeEach(() => {
          this.result = page();
          sandbox = sinon.createSandbox();
          sandbox.stub(JourneyContext, 'putContext').callsFake();
        });

        afterEach(() => {
          sandbox.restore();
        });

        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('postvalidate');

        });

        it('should go to the next page journey-summary if continue is pressed', () => {
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

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === 'journey-details') {
                  return {
                    "journeyDetails": [
                      [
                        {
                          "startPostcode": "XX1YY1",
                          "endPostcode": "XX1YY5",
                          "totalCost": "10.43"
                        }
                      ],
                      [
                        {
                          "startPostcode": "AA1BB1",
                          "endPostcode": "AA1BB6",
                          "totalCost": "15.50"
                        },
                        {
                          "startPostcode": "PP1QQ1",
                          "endPostcode": "PP1QQ9",
                          "totalCost": "20.05"
                        }
                      ]
                    ]
                  };
                } else if (page === 'travel-claim-days') {
                    let days =
                      [
                        {
                          "indexDay": 1,
                          "journeyNumber": 1
                        },
                        {
                          "indexDay": 2,
                          "journeyNumber": 2
                        }
                      ];
                    return days;
                } else if (page === 'travel-claim-month') {
                    return {
                        "monthIndex": "0",
                        "dateOfTravel": {
                          "mm": "1",
                          "yyyy": "1111"
                        }
                    };
                } else if (page === '__hidden_travel_page__') {
                  return {}
                }
                return undefined;
              },
              setDataForPage: setDataForPageStub
            }
          };

          const claim = {
            "0": {
              "monthYear": {
                "mm": "1",
                "yyyy": "1111"
              },
              "claim": [
                {
                  "dayOfTravel": 1,
                  "startPostcode": "XX1YY1",
                  "endPostcode": "XX1YY5",
                  "costOfTravel": "10.43"
                },
                {
                  "dayOfTravel": 2,
                  "startPostcode": "AA1BB1",
                  "endPostcode": "AA1BB6",
                  "costOfTravel": "15.50"
                },
                {
                  "dayOfTravel": 2,
                  "startPostcode": "PP1QQ1",
                  "endPostcode": "PP1QQ9",
                  "costOfTravel": "20.05"
                }
              ]
            }
          };

          this.result.hooks.postvalidate(req, res, nextStub);

          sinon.assert.calledWith(setDataForPageStub.lastCall, '__hidden_travel_page__', claim)
        });
      });
    });
  });
});
