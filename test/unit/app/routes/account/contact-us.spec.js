const rewire = require('rewire');
const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const page = rewire('../../../../../app/routes/account/contact-us');
const sinon = require('sinon');
const { claimTypesFullName } = require('../../../../../app/config/claim-types');

const axiosStub = sinon.stub();

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

page.__set__('axios', axiosStub);

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

    it('Other option selected on multi-grant screen', async () => {
      const router = page(app);

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              elements: [
                {
                  id: 321,
                  company: 'xyz',
                },
              ],
            },
          };
        },
      };

      req.session = {
        grantSummary: {
          awardType: "Other",
        },
        save: sinon.stub()
          .callsFake((cb) => {
            if (cb) {
              cb();
            }
          }),
      };
      await router.getPage(req, res);

      expect(req.sessionSaved)
        .to
        .be
        .equal(false);
      assert.equal(res.rendered.view, 'pages/account/contact-us.njk');
    });

  });
});

