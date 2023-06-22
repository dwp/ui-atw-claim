const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const page = require('../../../../../app/routes/account/contact-us');
const chai = require('chai');
const {
  assert,
} = chai;
const sinon = require('sinon');
const { claimTypesFullName } = require('../../../../../app/config/claim-types');
chai.use(require('sinon-chai'));

describe('/about-your-grant', () => {
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

    it('GET - contact-us.njk', async () => {
      const router = page(app);

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              elements: [
                {
                  claimType: claimTypesFullName.SW,
                },
              ],
            },
          };
        },
      };

      await router.getPage(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.rendered.view, 'pages/account/contact-us.njk');
    });
  });
});

