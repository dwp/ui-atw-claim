const rewire = require('rewire');
const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const page = rewire('../../../../../app/routes/account/home');
const sinon = require('sinon');

const axiosStub = sinon.stub();
page.__set__('axios', axiosStub);

const validCountRejectedResponse = {
  status: 200,
      "data": [
      {
        "claimType": "TRAVEL_TO_WORK",
        "count": 1
      },
      {
        "claimType": "SUPPORT_WORKER",
        "count": 3
      }
    ]
}

let assert;
(async() => {
  assert = (await import ('chai')).assert;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('/home', () => {
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

    it('GET -  home.njk', async () => {
      const router = page(app);

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              'claimant': {
                forename: 'Test',
                surname: 'User',
              }
            }
          };
        },
      };

      axiosStub.resolves(Promise.resolve(validCountRejectedResponse));
      await router.getPage(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.locals.numberOfRejectedClaims, 4);
      assert.equal(res.locals.fullName, 'Test User');
      assert.equal(res.rendered.view, 'pages/account/home.njk');
    });

    it('GET -  home.njk - returned claim rejected count endpoint error', async () => {
      const router = page(app);

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              'claimant': {
                forename: 'Test',
                surname: 'User',
              }
            }
          };
        },
      };

      axiosStub.resolves(Promise.reject({ response: 'error' }));
      await router.getPage(req, res);

      assert.equal(res.locals.numberOfRejectedClaims, 0);
      assert.equal(res.locals.fullName, 'Test User');
      assert.equal(res.rendered.view, 'pages/account/home.njk');
    });
  });
});

