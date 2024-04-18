const page = require("../../../../../../app/definitions/pages/travel-in-work/travel-claim-month");
const { assert, expect } = require("chai");
const Request = require("../../../../../helpers/fakeRequest");
const Response = require("../../../../../helpers/fakeResponse");
const sinon = require("sinon");
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

const { removeAllSpaces } = require('../../../../../../app/utils/remove-all-spaces.js');

describe("definitions/pages/travel-in-work/travel-claim-month", () => {
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
            "pages/travel-in-work/travel-claim-month.njk"
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

          expect(res.locals.casa.journeyPreviousUrl).to.equal("/claim/travel-in-work/taxi-journeys-summary");
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

          const nextStub = sinon.stub()

          this.result.hooks.prerender(req, res, nextStub);

          expect(req.query.changeMonthYear).to.be.equal(undefined);

          expect(nextStub).to.be.calledOnceWithExactly();

        });

        it('should not be inEditMode prerender', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const sandbox = sinon.createSandbox();
          sandbox.stub(JourneyContext, 'putContext').callsFake();

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.inEditMode = false;

          this.result.hooks.prerender(req, res, nextStub);

          assert.equal(res.locals.monthIndex, 0);

          sinon.assert.notCalled(setDataForPageStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          sandbox.restore();
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
