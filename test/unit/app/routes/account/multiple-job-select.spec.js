const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const page = require('../../../../../app/definitions/pages/pre/multiple-job-select');
const sinon = require('sinon');
const {
  claimTypesFullName
} = require('../../../../../app/config/claim-types');
const {
  ACCOUNT_ROOT_URL,
  GRANT_ROOT_URL,
} = require('../../../../../app/config/uri');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('/multiple-job-select', () => {
  const moreThanYearAgoDate = new Date();
  moreThanYearAgoDate.setFullYear(moreThanYearAgoDate.getFullYear() - 2);
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);

  const req = new Request();
  const res = new Response(req);

  let sandbox;
  beforeEach(() => {
    this.result = page();
    sandbox = sinon.createSandbox();
    sandbox.stub(JourneyContext, 'putContext').callsFake();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should be a function', () => {
    assert.typeOf(page, 'function');
  });

  it('value be a string', () => {
    assert.typeOf(page().view, 'string');
    assert.equal(page().view, 'pages/account/multiple-job-select.njk');
  });

  describe('`fieldValidators` key', () => {
    it('should be defined', () => {
      expect(Object.keys(page()))
        .to
        .includes('fieldValidators');
    });

    it('value should return an object', () => {
      assert.typeOf(page().fieldValidators, 'object');
    });
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

    describe('GET', () => {
      describe('Only 1 job in account', () => {
        it(claimTypesFullName.EA, async () => {
          const router = page(app);
          req.session.grantSummary = { awardType: claimTypesFullName.EA },

          req.casa.journeyContext = {
            getDataForPage: () => {
              return {
                'account': {
                  elements: [
                    {
                      id: 321,
                      company: 'xyz',
                      claimType: claimTypesFullName.EA,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                      company: 'Google',
                    },
                  ],
                },
              };
            },
          };

          await router.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.statusCode, 200);

          expect(res.redirectedTo)
            .to
            .be
            .equal(`${GRANT_ROOT_URL}/grant-summary`);
        });

        it(claimTypesFullName.SW, async () => {
          const router = page(app);
          req.session.grantSummary = { awardType: claimTypesFullName.SW },

          req.casa.journeyContext = {
            getDataForPage: () => {
              return {
                'account': {
                  elements: [
                    {
                      id: 321,
                      company: 'xyz',
                      claimType: claimTypesFullName.SW,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                      company: 'Google',
                    },
                  ],
                },
              };
            },
          };

          await router.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.statusCode, 200);
          expect(res.redirectedTo)
            .to
            .be
            .equal(`${GRANT_ROOT_URL}/grant-summary`);
        });

        it(claimTypesFullName.TW, async () => {
          const router = page(app);
          req.session.grantSummary = { awardType: claimTypesFullName.TW },

          req.casa.journeyContext = {
            getDataForPage: () => {
              return {
                'account': {
                  elements: [
                    {
                      id: 321,
                      company: 'xyz',
                      claimType: claimTypesFullName.TW,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                      company: 'Google',
                    },
                  ],
                },
              };
            },
          };

          await router.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.statusCode, 200);
          expect(res.redirectedTo)
            .to
            .be
            .equal(`${GRANT_ROOT_URL}/grant-summary`);
        });
      });

      describe('More than 1 jobs in account', () => {

        it('Multiple jobs for same claim type', async () => {
          const router = page(app);

          req.casa.journeyContext = {
            getDataForPage: () => {
              return {
                'account': {
                  elements: [
                    {
                      id: 123,
                      company: 'abc',
                      claimType: claimTypesFullName.TW,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                      company: 'Google',
                    },
                    {
                      id: 456,
                      company: 'xyz',
                      claimType: claimTypesFullName.TW,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                      company: 'BT',
                    },
                  ],
                },
              };
            },
          };

          await router.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.statusCode, 200);
          assert.deepEqual(res.locals.jobs, ['Google', 'BT']);
          expect(res.redirectedTo)
            .to
            .be
            .equal(`${GRANT_ROOT_URL}/grant-summary`);
        });

      });
    });

    describe('POST', () => {
      it(`${claimTypesFullName.EA} - redirect to grant-summary page`, async () => {
        const router = page(app);

        req.casa.journeyContext = {
          getDataForPage: () => ({
            selectClaimType: claimTypesFullName.EA,
          }),
        };
        router.hooks.postvalidate(req, res, sinon.stub());

        assert.equal(res.statusCode, 200);
        expect(res.redirectedTo)
          .to
          .be
          .equal(`${GRANT_ROOT_URL}/grant-summary`);
      });

      it(`${claimTypesFullName.TW} - redirect to grant-summary page`, async () => {
        const router = page(app);

        req.casa.journeyContext = {
          getDataForPage: () => ({
            selectClaimType: claimTypesFullName.TW,
          }),
        };

        router.hooks.postvalidate(req, res, sinon.stub());

        assert.equal(res.statusCode, 200);
        expect(res.redirectedTo)
          .to
          .be
          .equal(`${GRANT_ROOT_URL}/grant-summary`);
      });

      it(`${claimTypesFullName.SW} - redirect to grant-summary page`, async () => {
        const router = page(app);

        req.casa.journeyContext = {
          getDataForPage: () => ({
            selectClaimType: claimTypesFullName.SW,
          }),
        };

        router.hooks.postvalidate(req, res, sinon.stub());

        assert.equal(res.statusCode, 200);
        expect(res.redirectedTo)
          .to
          .be
          .equal(`${GRANT_ROOT_URL}/grant-summary`);
      });

      it('Other option selected', async () => {
        const router = page(app);

        req.casa.journeyContext = {
          getDataForPage: () => ({
            'account': {
              elements: [
                {
                  id: 123,
                  claimType: claimTypesFullName.TW,
                },
              ],
            },
            selectJob: 'other',
          }),
        };

        router.hooks.postvalidate(req, res);

        expect(req.sessionSaved)
          .to
          .be
          .equal(true);

        expect(res.redirectedTo)
          .to
          .be
          .equal(`${ACCOUNT_ROOT_URL}/contact-access-to-work`);
      });

    });
  });
});
