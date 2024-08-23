const page = require('../../../../../../app/definitions/pages/travel-in-work/your-travel-during-work-grant');
const sinon = require('sinon');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const { claimTypesFullName } = require('../../../../../../app/config/claim-types');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('definitions/pages/travel-in-work/your-travel-during-work-grant', () => {
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
          assert.equal(this.result.view, 'pages/travel-in-work/your-travel-during-work-grant.njk');
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
      describe('`hooks` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result)).to.includes('hooks');

          expect(Object.keys(this.result.hooks)).to.includes('prerender');
        });

        it('should contain hideBackButton', () => {
          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();
          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: (pageName) => {

                if (pageName === '__grant_being_claimed__') {
                  return {
                    test: "details"
                  };
                }
              },
            },
          };

          this.result.hooks.prerender(req, res, nextStub);
          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly("__journey_type__" ,
              { journeyType: claimTypesFullName.TIW });

          expect(res.locals.grant).to.deep.equal(
            {
              test: "details"
            }
          );

          expect(nextStub).to.be.calledOnceWithExactly();
        });
      });
    });
  });
});
