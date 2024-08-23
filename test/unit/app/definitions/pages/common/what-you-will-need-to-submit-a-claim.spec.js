const page = require('../../../../../../app/definitions/pages/common/what-you-will-need-to-submit-a-claim');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const sinon = require('sinon');
const { claimTypesFullName } = require('../../../../../../app/config/claim-types');

let assert, expect;

(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
})();


describe('definitions/pages/equipment-or-adaptation/what-you-will-need-to-submit-a-claim', () => {
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
          assert.equal(this.result.view, 'pages/common/what-you-will-need-to-submit-a-claim.njk');
        });
      });
      describe('`fieldValidators` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('fieldValidators');
        });
      });

      describe('`prerender` key', () => {
        it('should be defined - EA', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const req = new Request();
          const res = new Response(req);

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === '__journey_type__') {
                  return {
                    journeyType: claimTypesFullName.EA,
                  };
                }
              },
            }
          };

          this.result.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.locals.pageFile, 'pages/equipment-or-adaptation/what-you-will-need-to-submit-a-claim.njk');
          assert.equal(res.locals.journeyType, claimTypesFullName.EA);
          assert.equal(res.locals.BUTTON_TEXT, 'what-you-will-need-to-submit-a-claim:common.continueButton');
        });

        it('should be defined - SW', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const req = new Request();
          const res = new Response(req);

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === '__journey_type__') {
                  return {
                    journeyType: claimTypesFullName.SW,
                  };
                }
              },
            }
          };
          this.result.hooks.prerender(req, res, sinon.stub());
          assert.equal(res.locals.pageFile, 'pages/support-worker/what-you-will-need-to-submit-a-claim.njk');
          assert.equal(res.locals.journeyType, claimTypesFullName.SW);
          assert.equal(res.locals.BUTTON_TEXT, 'what-you-will-need-to-submit-a-claim:common.continueButton');
        });

        it('should be defined - TW', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const req = new Request();
          const res = new Response(req);

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === '__journey_type__') {
                  return {
                    journeyType: claimTypesFullName.TW,
                  };
                }
              },
            }
          };
          this.result.hooks.prerender(req, res, sinon.stub());
          assert.equal(res.locals.pageFile, 'pages/travel-to-work/what-you-will-need-to-submit-a-claim.njk');
          assert.equal(res.locals.journeyType, claimTypesFullName.TW);
          assert.equal(res.locals.BUTTON_TEXT, 'what-you-will-need-to-submit-a-claim:common.continueButton');
        });

        it('should be defined - AV', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const req = new Request();
          const res = new Response(req);

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === '__journey_type__') {
                  return {
                    journeyType: claimTypesFullName.AV,
                  };
                }
              },
            }
          };
          this.result.hooks.prerender(req, res, sinon.stub());
          assert.equal(res.locals.pageFile, 'pages/vehicle-adaptations/what-you-will-need-to-submit-a-claim.njk');
          assert.equal(res.locals.journeyType, claimTypesFullName.AV);
          assert.equal(res.locals.BUTTON_TEXT, 'what-you-will-need-to-submit-a-claim:common.continueButton');
        });

        it('should throw error if invalid journey type', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const req = new Request();
          const res = new Response(req);

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === '__journey_type__') {
                  return {
                    journeyType: 'TIW',
                  };
                }
              },
            }
          };

          expect(() => this.result.hooks.prerender(req, res, sinon.stub()))
            .to
            .throw();
        });

        it('should be defined - TiW', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const req = new Request();
          const res = new Response(req);

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === '__journey_type__') {
                  return {
                    journeyType: claimTypesFullName.TIW,
                  };
                }
              },
            }
          };
          this.result.hooks.prerender(req, res, sinon.stub());
          assert.equal(res.locals.pageFile, 'pages/travel-in-work/what-you-will-need-to-submit-a-claim.njk');
          assert.equal(res.locals.journeyType, claimTypesFullName.TIW);
          assert.equal(res.locals.BUTTON_TEXT, 'what-you-will-need-to-submit-a-claim:common.continueButton');
        });

      });
    });
  });
});
