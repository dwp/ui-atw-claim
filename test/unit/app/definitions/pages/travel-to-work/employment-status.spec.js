const page = require('../../../../../../app/definitions/pages/travel-to-work/employment-status');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const sinon = require('sinon');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const validators = require('../../../../../../app/definitions/field-validators/travel-to-work/employment-status');
const {
  expectValidatorToFailWithJourney, 
} = require('../../../../../helpers/validator-assertions');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
})();

describe('definitions/pages/travel-to-work/employment-status', () => {
  it('should page a function', () => {
    assert.typeOf(page, 'function');
  });

  let sandbox;

  beforeEach(() => {
    this.result = page();
    sandbox = sinon.createSandbox();
    sandbox.stub(JourneyContext, 'putContext').callsFake();
  });

  afterEach(() => {
    sandbox.restore();
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
          assert.equal(this.result.view, 'pages/travel-to-work/employment-status.njk');
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

        it('trigger required error when continue clicked', async () => {
          await expectValidatorToFailWithJourney(
            validators,
            'employment-status',
            'employmentStatus',
            'Required',
            new JourneyContext({
              ['employment-status']: {
                employmentStatus: ''
              }
            }), {
              summary: 'employment-status:required',
              inline: 'employment-status:required'
            }
          )
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

        it('If TTW and Taxi journey', () => {
          const req = new Request();
          const res = new Response(req);
          const setDataForPageStub = sinon.stub();
          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === '__journey_type__') {
                  return {
                    journeyType: 'TTW',
                  };
                } else if (page === 'which-journey-type') {
                  return {
                    howDidYouTravelForWork: 'Taxi'
                  };
                }
                return undefined;
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          expect(res.locals.journeyType).to
            .deep
            .equal('TTW');

          expect(res.locals.howDidYouTravelForWork).to
            .deep
            .equal('Taxi');
        })

      })

      describe('postvalidate', () => {

        beforeEach(() => {
          this.result = page();
        });
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('postvalidate');
        });

        it('If self employed get employment status data', () => {
          const req = new Request();
          const res = new Response(req);
          const setDataForPageStub = sinon.stub();
          req.casa = {
            journeyContext: {
              getDataForPage: () => {
                return {
                  employmentStatus: 'selfEmployed'
                };
              },
              setDataForPage: setDataForPageStub
            }
          };

          this.result.hooks.postvalidate(req, res, sinon.stub());

          sinon.assert.callCount(setDataForPageStub, 2);
          sinon.assert.calledWith(setDataForPageStub.getCall(0), 'confirmer-details', undefined);
          sinon.assert.calledWith(setDataForPageStub.getCall(1), 'check-confirmer-details', undefined);
        });

      });
    });
  });
});
