const chai = require('chai');
const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const page = require('../../../../../app/definitions/pages/pre/multiple-claims-history');
const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
const {
  claimTypesFullName
} = require('../../../../../app/config/claim-types');
const {
  ACCOUNT_ROOT_URL,
} = require('../../../../../app/config/uri');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
chai.use(require('sinon-chai'));

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

describe('/multiple-claims-history', () => {
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
    assert.equal(page().view, 'pages/account/multiple-claims-history.njk');
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
      describe('Only 1 grantType in account', () => {
        it(claimTypesFullName.EA, async () => {
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

          await router.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.statusCode, 200);

          expect(res.redirectedTo)
            .to
            .be
            .equal(`${ACCOUNT_ROOT_URL}/your-claims`);
        });

        it(claimTypesFullName.SW, async () => {
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

          await router.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.statusCode, 200);
          expect(res.redirectedTo)
            .to
            .be
            .equal(`${ACCOUNT_ROOT_URL}/your-claims`);
        });

        it(claimTypesFullName.TW, async () => {
          const router = page(app);

          req.casa.journeyContext = {
            getDataForPage: () => {
              return {
                'account': {
                  elements: [
                    {
                      claimType: claimTypesFullName.TW,
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
            .equal(`${ACCOUNT_ROOT_URL}/your-claims`);
        });
      });

      describe('More than grantType in account', () => {
        it('2 claims', async () => {
          const router = page(app);

          req.casa.journeyContext = {
            getDataForPage: () => {
              return {
                'account': {
                  elements: [
                    {
                      claimType: claimTypesFullName.EA,
                    }, {
                      claimType: claimTypesFullName.TW,
                    },
                  ]
                },
              };
            },
          };
          const nextStub = sinon.stub();

          await router.hooks.prerender(req, res, nextStub);

          assert.equal(res.locals.eligibleForAtv, false);
          assert.equal(res.locals.eligibleForEa, true);
          assert.equal(res.locals.eligibleForSw, false);
          assert.equal(res.locals.eligibleForTtw, true);
          assert.equal(res.statusCode, 200);
          expect(nextStub)
              .to
              .be
              .calledOnceWithExactly();
        });

        it('2 claims - with axios check', async () => {
          const router = page(app);
          const nextStub = sinon.stub();

          req.casa.journeyContext = {
            getDataForPage: () => {
              return {
                'account': {
                  nino: 'AA370773A',
                  elements: [
                    {
                      claimType: claimTypesFullName.EA,
                    }, {
                      claimType: claimTypesFullName.TW,
                    },
                  ],
                },
              };
            },
          };

          req.session.listOfRejectedClaims = validCountRejectedResponse.data;

          await router.hooks.prerender(req, res, nextStub);

          assert.equal(res.statusCode, 200);

          assert.equal(res.locals.eligibleForAtv, false);
          assert.equal(res.locals.eligibleForEa, true);
          assert.equal(res.locals.eligibleForSw, false);
          assert.equal(res.locals.eligibleForTtw, true);
          assert.equal(res.statusCode, 200);
          expect(nextStub)
              .to
              .be
              .calledOnceWithExactly();
        });

        it('3 claims', async () => {
          const router = page(app);

          req.casa.journeyContext = {
            getDataForPage: () => {
              return {
                'account': {
                  elements: [
                    {
                      claimType: claimTypesFullName.EA,
                    }, {
                      claimType: claimTypesFullName.TW,
                    }, {
                      claimType: claimTypesFullName.SW,
                    },
                  ],
                },
              };
            },
          };
          const nextStub = sinon.stub();

          await router.hooks.prerender(req, res, nextStub);

          assert.equal(res.locals.eligibleForAtv, false);
          assert.equal(res.locals.eligibleForEa, true);
          assert.equal(res.locals.eligibleForSw, true);
          assert.equal(res.locals.eligibleForTtw, true);
          assert.equal(res.statusCode, 200);
          expect(nextStub)
              .to
              .be
              .calledOnceWithExactly();
        });

        it('4 claims', async () => {
          const router = page(app);

          req.casa.journeyContext = {
            getDataForPage: () => {
              return {
                'account': {
                  elements: [
                    {
                      claimType: claimTypesFullName.AV,
                    }, {
                      claimType: claimTypesFullName.EA,
                    }, {
                      claimType: claimTypesFullName.TW,
                    }, {
                      claimType: claimTypesFullName.SW,
                    },
                  ],
                },
              };
            },
          };
          const nextStub = sinon.stub();

          await router.hooks.prerender(req, res, nextStub);

          assert.equal(res.locals.eligibleForAtv, true);
          assert.equal(res.locals.eligibleForEa, true);
          assert.equal(res.locals.eligibleForSw, true);
          assert.equal(res.locals.eligibleForTtw, true);
          assert.equal(res.statusCode, 200);
          expect(nextStub)
              .to
              .be
              .calledOnceWithExactly();
        });

        it('Multiple claims of same type', async () => {
          const router = page(app);

          req.casa.journeyContext = {
            getDataForPage: () => {
              return {
                'account': {
                  elements: [
                    {
                      claimType: claimTypesFullName.TW,
                    },
                    {
                      claimType: claimTypesFullName.TW,
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
            .equal(`${ACCOUNT_ROOT_URL}/your-claims`);
        });

      });
    });

    describe('POST', () => {
      it(`${claimTypesFullName.AV} - redirect to contact-us page`, async () => {
        const router = page(app);

        req.casa.journeyContext = {
          getDataForPage: () => ({
            selectClaimType: claimTypesFullName.AV,
          }),
        };
        router.hooks.postvalidate(req, res, sinon.stub());

        assert.equal(res.statusCode, 200);
        expect(res.redirectedTo)
          .to
          .be
          .equal(`${ACCOUNT_ROOT_URL}/your-claims`);
      });

      it(`${claimTypesFullName.EA} - redirect to contact-us page`, async () => {
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
          .equal(`${ACCOUNT_ROOT_URL}/your-claims`);
      });

      it(`${claimTypesFullName.TW} - redirect to contact-us page`, async () => {
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
          .equal(`${ACCOUNT_ROOT_URL}/your-claims`);
      });

      it(`${claimTypesFullName.SW} - redirect to contact-us page`, async () => {
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
          .equal(`${ACCOUNT_ROOT_URL}/your-claims`);
      });
    });
  });
});
