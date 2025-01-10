const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const page = require('../../../../../app/routes/account/about-your-grant');
const sinon = require('sinon');
const {
  claimTypesFullName
} = require('../../../../../app/config/claim-types');

let assert;
(async() => {
  assert = (await import ('chai')).assert;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('/about-your-grant', () => {
  const req = new Request();
  const res = new Response(req);

  it('should be a function', () => {
    assert.typeOf(page, 'function');
  });

  describe('different scenarios of employer(s)', () => {
    const endSessionStub = sinon.stub();
    endSessionStub.resolves(Promise.resolve());

    const app = {
      endSession: endSessionStub,
      router: {
        get: sinon.stub(),
        post: sinon.stub(),
      },
    };

    it('Single employer', async () => {
      const router = page(app);

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              elements: [
                {
                  claimType: claimTypesFullName.EA,
                  company: 'ITV',
                  endDate: '2030-01-01',
                }
              ],
            },
          };
        },
      };

      await router.getPage(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.locals.employers, 'ITV');
      assert.equal(res.rendered.view, 'pages/account/about-your-grant.njk');
    });

    it('Multiple employers', async () => {
      const router = page(app);

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              elements: [
                {
                  claimType: claimTypesFullName.EA,
                  company: 'ITV',
                  endDate: '2030-01-01',
                },
                {
                  claimType: claimTypesFullName.EA,
                  company: 'BBC',
                  endDate: '2030-01-01',
                },
              ],
            },
          };
        },
      };

      await router.getPage(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.locals.employers, 'ITV and BBC');
      assert.equal(res.rendered.view, 'pages/account/about-your-grant.njk');
    });

    it('Multiple employers with duplication', async () => {
      const router = page(app);

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              elements: [
                {
                  claimType: claimTypesFullName.EA,
                  company: 'ITV',
                  endDate: '2030-01-01',
                },
                {
                  claimType: claimTypesFullName.EA,
                  company: 'ITV',
                  endDate: '2030-01-01',
                },,
                {
                  claimType: claimTypesFullName.EA,
                  company: 'Channel 4',
                  endDate: '2020-01-01',
                },
                {
                  claimType: claimTypesFullName.EA,
                  company: 'BBC',
                  endDate: '2030-01-01',
                },
                {
                  claimType: claimTypesFullName.EA,
                  company: 'Google',
                  endDate: '2030-01-01',
                },
              ],
            },
          };
        },
      };

      await router.getPage(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.locals.employers, 'ITV, BBC and Google');
      assert.equal(res.rendered.view, 'pages/account/about-your-grant.njk');
    });

    it('All duplicate employers', async () => {
      const router = page(app);

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              elements: [
                {
                  claimType: claimTypesFullName.EA,
                  company: 'ITV',
                  endDate: '2030-01-01',
                },
                {
                  claimType: claimTypesFullName.EA,
                  company: 'ITV',
                  endDate: '2030-01-01',
                },
                {
                  claimType: claimTypesFullName.EA,
                  company: 'ITV',
                  endDate: '2030-01-01',
                }
              ],
            },
          };
        },
      };

      await router.getPage(req, res);

      assert.equal(res.statusCode, 200);
      assert.equal(res.locals.employers, 'ITV');
      assert.equal(res.rendered.view, 'pages/account/about-your-grant.njk');
    });
  });
});
