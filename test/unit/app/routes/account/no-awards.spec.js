const rewire = require('rewire');
const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const page = rewire('../../../../../app/routes/account/no-awards')
const sinon = require('sinon');
const axiosStub = sinon.stub();
page.__set__('axios', axiosStub);

let assert;
(async() => {
  assert = (await import ('chai')).assert;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('/no-awards', () => {
  const req = new Request();
  const res = new Response(req);

  it('should be a function', () => {
    assert.typeOf(page, 'function');
  });

  describe('when called', () => {
    const endSessionStub = sinon.stub();
    endSessionStub.resolves(Promise.resolve());

    const app = {
      endSession: endSessionStub,
      router: {
        get: sinon.stub(),
        post: sinon.stub(),
      },
    };

    it('Display no-awards screen when there are no awards', async () => {
      const router = page(app);

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              elements: [],
            },
          };
        },
      };

      await router.getPage(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.rendered.view, 'pages/account/no-awards.njk');
    });

    it('Display no-awards screen when awards are expired', async () => {
      const router = page(app);

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              elements: [
                {
                  "id": 86710208,
                  "claimType": "TRAVEL_IN_WORK",
                  "spendToDate": 40.0,
                  "totalCost": 31285.7143,
                  "nonAtwCost": 0.0,
                  "atwCost": 31285.7143,
                  "startDate": "2020-02-21",
                  "endDate": "2023-02-19",
                  "company": "Travel in Work Music"
                },
              ],
            },
          };
        },
      };

      await router.getPage(req, res);

      assert.equal(res.rendered.view, 'pages/account/no-awards.njk');
    });

    it('Display no-awards grant screen when called', async () => {
      const router = page(app);

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              elements: [],
            },
          };
        },
      };

      await router.getPageGrant(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.locals.noAwardsGrant, true);
      assert.equal(res.rendered.view, 'pages/account/no-awards.njk');
    });

    it('Display no-awards claims screen when called', async () => {
      const router = page(app);

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              elements: [],
            },
          };
        },
      };

      await router.getPageClaims(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.locals.noAwardsClaim, true);
      assert.equal(res.rendered.view, 'pages/account/no-awards.njk');
    });

  });
});
