const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const page = require('../../../../../app/routes/account/multiple-claims-exit');

const sinon = require('sinon');
const { claimTypesFullName } = require('../../../../../app/config/claim-types');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('/multiple-claims-exit.spec', () => {
  let app;
  let req;  
  let res;  
  let endSessionStub 

  beforeEach(() => {
    req = new Request();
    res = new Response(req);
    endSessionStub = sinon.stub();
    app = {
      endSession: endSessionStub,
      router: {
        get: sinon.stub(),
        post: sinon.stub(),
      },
    };
  })

  it('should be a function', () => {
    assert.typeOf(page, 'function');
  });

  describe('when called', () => {
    it('GET - multiple-claims-exit.njk', async () => {
      endSessionStub.resolves(Promise.resolve());
      const router = page(app);

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              elements: [
                {
                  claimType: claimTypesFullName.EA,
                },
              ],
            },
          };
        },
      };

      await router.getPage(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.rendered.view, 'pages/account/multiple-claims-exit.njk');
    });

  });

  describe('GET - multiple-claims-exit.njk - multiple grant awards', () => {
    it('should display all grant awards in the heading when the user has more than one unique grant award', async () => {
      const router = page(app);

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              elements: [
                {
                  claimType: claimTypesFullName.EA,
                },
                {
                  claimType: claimTypesFullName.SW,
                },
              ],
            },
          };
        },
      };

      await router.getPage(req, res);
      
      expect(res.locals.headingString).to.be.eq('specialist equipment or support worker');
    })

    it('should display only one grant award in the heading when user has more than one grant award of the same type', async () => {
      const router = page(app);

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              elements: [
                {
                  claimType: claimTypesFullName.EA,
                },
                {
                  claimType: claimTypesFullName.EA,
                },
              ],
            },
          };
        },
      };

      await router.getPage(req, res);
      
      expect(res.locals.headingString).to.be.eq('specialist equipment');
    })
  })
});

