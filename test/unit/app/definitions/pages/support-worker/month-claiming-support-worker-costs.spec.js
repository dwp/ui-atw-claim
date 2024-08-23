const page = require("../../../../../../app/definitions/pages/support-worker/month-claiming-support-worker-costs");
const Request = require("../../../../../helpers/fakeRequest");
const Response = require("../../../../../helpers/fakeResponse");
const sinon = require("sinon");
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

const { removeAllSpaces, removeLeadingZero } = require('../../../../../../app/utils/remove-all-spaces.js');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
})();

describe("definitions/pages/support-worker/month-claiming-support-worker-costs", () => {
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
              "pages/support-worker/month-claiming-support-worker-costs.njk"
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
        let sandbox;
        beforeEach(() => {
          this.result = page();
          sandbox = sinon.createSandbox();
          sandbox.stub(JourneyContext, 'putContext').callsFake();
        });

        afterEach(() => {
          sandbox.restore();
        });

        it("should be defined", () => {
          expect(Object.keys(this.result)).to.includes("hooks");
          expect(Object.keys(this.result.hooks)).to.includes("prerender");
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

          expect(res.locals.casa.journeyPreviousUrl).to.equal("/claim/support-worker/support-claim-summary");
        });

        it("set monthIndex to value from page", () => {
          const req = new Request();
          const res = new Response(req);

          req.casa = {
            journeyContext: {
              getDataForPage: () => {
                return {
                  monthIndex: "1",
                };
              },
            },
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.monthIndex).to.equal("1");
        });

        it("set monthIndex to 0 if no page data", () => {
          const req = new Request();
          const res = new Response(req);

          req.casa = {
            journeyContext: {
              getDataForPage: () => {
                return undefined;
              },
            },
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.monthIndex).to.equal("0");
        });

        it("Change mode set to undefined", () => {
          const req = new Request();
          const res = new Response(req);

          req.query = {};

          expect(req.query.changeMonthYear)
              .to
              .be
              .equal(undefined);

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

            req.body.dateOfSupport = {
              mm: ' 1 ',
              yyyy: ' 2023'
            }

            this.result.hooks.pregather(req, res, nextStub);

            expect(req.body.dateOfSupport.mm)
                .to
                .equal('1');
            expect(req.body.dateOfSupport.yyyy)
                .to
                .equal('2023');
          });
        });

        describe('Utils: removeLeadingZeros', () => {
          it('should export a function', () => {
            expect(removeLeadingZero)
              .to
              .be
              .a('function');
          });

          it('should strip leading zeros from a string', () => {
            expect(Object.keys(this.result))
              .to
              .includes('hooks');
            expect(Object.keys(this.result.hooks))
              .to
              .includes('pregather');

            const req = new Request();
            const res = new Response(req);
            const nextStub = sinon.stub();

            req.body.dateOfSupport = {
              mm: '01',
              yyyy: '02023'
            }

            this.result.hooks.pregather(req, res, nextStub);

            expect(req.body.dateOfSupport.mm)
                .to
                .equal('1');
            expect(req.body.dateOfSupport.yyyy)
                .to
                .equal('2023');
          });
        });
      });

      describe("preredirect", () => {
        let sandbox;
        beforeEach(() => {
          this.result = page();
          sandbox = sinon.createSandbox();
          sandbox.stub(JourneyContext, 'putContext').callsFake();
        });

        afterEach(() => {
          sandbox.restore();
        });

        it("should be defined", () => {
          expect(Object.keys(this.result)).to.includes("hooks");
          expect(Object.keys(this.result.hooks)).to.includes("preredirect");
        });

        it("check indexOfAlreadyExistingMonth", () => {
          const req = new Request();
          const res = new Response(req);

          const setDataForPageStub = sinon.stub();
          const nextStub = sinon.stub();

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: () => {
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
              },
            },
          };

          req.body.dateOfSupport = {
            mm: "12",
            yyyy: "2020"
          }

          this.result.hooks.preredirect(req, res, nextStub);

          sinon.assert.calledOnce(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'support-month', {
            monthIndex: '0',
            dateOfSupport: {
              mm: "12",
              yyyy: "2020"
            },
          });

        });

        it("inEditMode preredirect", () => {
          const req = new Request();
          const res = new Response(req);

          const setDataForPageStub = sinon.stub();
          const nextStub = sinon.stub();

          req.inEditMode = true;

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: () => {
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
              },
            },
          };

          req.body.dateOfSupport = {
            mm: "11",
            yyyy: "2020"
          }

          this.result.hooks.preredirect(req, res, nextStub);

          sinon.assert.calledTwice(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'support-days', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall, 'support-claim-summary', undefined);

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

            req.body.dateOfSupport = {
              mm: ' 1 ',
              yyyy: ' 2023'
            }

            this.result.hooks.pregather(req, res, nextStub);

            expect(req.body.dateOfSupport.mm)
                .to
                .equal('1');
            expect(req.body.dateOfSupport.yyyy)
                .to
                .equal('2023');
          });
        });

        describe('Utils: removeLeadingZeros', () => {
          it('should export a function', () => {
            expect(removeLeadingZero)
                .to
                .be
                .a('function');
          });

          it('should strip leading zeros from a string', () => {
            expect(Object.keys(this.result))
                .to
                .includes('hooks');
            expect(Object.keys(this.result.hooks))
                .to
                .includes('pregather');

            const req = new Request();
            const res = new Response(req);
            const nextStub = sinon.stub();

            req.body.dateOfSupport = {
              mm: '01',
              yyyy: '02023'
            }

            this.result.hooks.pregather(req, res, nextStub);

            expect(req.body.dateOfSupport.mm)
                .to
                .equal('1');
            expect(req.body.dateOfSupport.yyyy)
                .to
                .equal('2023');
          });
        });
      });

      describe("postvalidate", () => {
        let sandbox;
        beforeEach(() => {
          this.result = page();
          sandbox = sinon.createSandbox();
          sandbox.stub(JourneyContext, 'putContext').callsFake();
        });
        afterEach(() => {
          sandbox.restore();
        });
        it("should be defined", () => {
          expect(Object.keys(this.result)).to.includes("hooks");
          expect(Object.keys(this.result.hooks)).to.includes("postvalidate");
        });

        it("not inEditMode postvalidate", () => {
          const req = new Request();
          const res = new Response(req);

          const setDataForPageStub = sinon.stub();
          const nextStub = sinon.stub();

          req.inEditMode = false;

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
            },
          };

          this.result.hooks.postvalidate(req, res, nextStub);

          sinon.assert.calledOnce(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall, 'support-claim-summary', undefined);

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

            req.body.dateOfSupport = {
              mm: ' 1 ',
              yyyy: ' 2023'
            }

            this.result.hooks.pregather(req, res, nextStub);

            expect(req.body.dateOfSupport.mm)
                .to
                .equal('1');
            expect(req.body.dateOfSupport.yyyy)
                .to
                .equal('2023');
          });
        });

        describe('Utils: removeLeadingZeros', () => {
          it('should export a function', () => {
            expect(removeLeadingZero)
                .to
                .be
                .a('function');
          });

          it('should strip leading zeros from a string', () => {
            expect(Object.keys(this.result))
                .to
                .includes('hooks');
            expect(Object.keys(this.result.hooks))
                .to
                .includes('pregather');

            const req = new Request();
            const res = new Response(req);
            const nextStub = sinon.stub();

            req.body.dateOfSupport = {
              mm: '01',
              yyyy: '02023'
            }

            this.result.hooks.pregather(req, res, nextStub);

            expect(req.body.dateOfSupport.mm)
                .to
                .equal('1');
            expect(req.body.dateOfSupport.yyyy)
                .to
                .equal('2023');
          });
        });
      });
    });
  });
});
