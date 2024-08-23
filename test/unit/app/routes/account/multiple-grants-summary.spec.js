const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const page = require('../../../../../app/definitions/pages/pre/multiple-grants-summary');

const sinon = require('sinon');
const {
  claimTypesFullName
} = require('../../../../../app/config/claim-types');
const {
  GRANT_ROOT_URL,
  ACCOUNT_ROOT_URL,
} = require('../../../../../app/config/uri');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('/multiple-grants-summary', () => {
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
    assert.equal(page().view, 'pages/account/multiple-grants-summary.njk');
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
                      id: 321,
                      company: 'xyz',
                      claimType: claimTypesFullName.EA,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
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
            .equal(`${GRANT_ROOT_URL}/grant-summary`);
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
            .equal(`${GRANT_ROOT_URL}/grant-summary`);
        });

        it(claimTypesFullName.AV, async () => {
          const router = page(app);

          req.casa.journeyContext = {
            getDataForPage: () => {
              return {
                'account': {
                  elements: [
                    {
                      claimType: claimTypesFullName.AV,
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

      describe('More than grantType in account', () => {
        it('2 claims', async () => {
          const router = page(app);

          req.casa.journeyContext = {
            getDataForPage: () => {
              return {
                'account': {
                  elements: [
                    {
                      id: 123,
                      company: 'abc',
                      claimType: claimTypesFullName.EA,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                    }, {
                      id: 124,
                      company: 'abc',
                      claimType: claimTypesFullName.TW,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                    },
                  ]
                },
              };
            },
          };
          const nextStub = sinon.stub();

          await router.hooks.prerender(req, res, nextStub);

          assert.equal(res.locals.eligibleForEa, true);
          assert.equal(res.locals.eligibleForSw, false);
          assert.equal(res.locals.eligibleForTtw, true);
          assert.equal(res.locals.eligibleForAtv, false);
          assert.equal(res.locals.eligibleForTiw, false);
          assert.equal(res.statusCode, 200);
          expect(nextStub)
              .to
              .be
              .calledOnceWithExactly();
        });

        it('2 claims - 1 expired', async () => {
          const router = page(app);
          const setDataForPageStub = sinon.stub();

          req.casa.journeyContext = {
            setDataForPage: setDataForPageStub,
            getDataForPage: () => {
              return {
                'account': {
                  elements: [
                    {
                      id: 123,
                      company: 'abc',
                      claimType: claimTypesFullName.EA,
                      endDate: moreThanYearAgoDate.toJSON()
                        .slice(0, 10),
                    }, {
                      id: 124,
                      company: 'abc',
                      claimType: claimTypesFullName.TW,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                    },
                  ],
                },
              };
            },
            clearValidationErrorsForPage: sinon.stub(),
          };
          const nextStub = sinon.stub();

          router.hooks.prerender(req, res, nextStub);

          assert.equal(res.statusCode, 200);

          expect(res.redirectedTo)
            .to
            .be
            .equal(`${GRANT_ROOT_URL}/grant-summary`);

        });

        it('3 claims', async () => {
          const router = page(app);

          req.casa.journeyContext = {
            getDataForPage: () => {
              return {
                'account': {
                  elements: [
                    {
                      id: 123,
                      company: 'abc',
                      claimType: claimTypesFullName.SW,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                    }, {
                      id: 123,
                      company: 'abc',
                      claimType: claimTypesFullName.EA,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                    }, {
                      id: 123,
                      company: 'abc',
                      claimType: claimTypesFullName.TW,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                    },
                  ],
                },
              };
            },
          };
          const nextStub = sinon.stub();

          await router.hooks.prerender(req, res, nextStub);

          assert.equal(res.locals.eligibleForEa, true);
          assert.equal(res.locals.eligibleForSw, true);
          assert.equal(res.locals.eligibleForTtw, true);
          assert.equal(res.locals.eligibleForAtv, false);
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
                      id: 123,
                      company: 'abc',
                      claimType: claimTypesFullName.SW,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                    }, {
                      id: 123,
                      company: 'abc',
                      claimType: claimTypesFullName.EA,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                    }, {
                      id: 123,
                      company: 'abc',
                      claimType: claimTypesFullName.TW,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                    }, {
                      id: 123,
                      company: 'abc',
                      claimType: claimTypesFullName.AV,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                    },
                  ],
                },
              };
            },
          };
          const nextStub = sinon.stub();

          await router.hooks.prerender(req, res, nextStub);

          assert.equal(res.locals.eligibleForEa, true);
          assert.equal(res.locals.eligibleForSw, true);
          assert.equal(res.locals.eligibleForTtw, true);
          assert.equal(res.locals.eligibleForAtv, true);
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
                      id: 123,
                      company: 'abc',
                      claimType: claimTypesFullName.TW,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                    },
                    {
                      id: 456,
                      company: 'xyz',
                      claimType: claimTypesFullName.TW,
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
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

      it(`${claimTypesFullName.AV} - redirect to grant-summary page`, async () => {
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
            selectClaimType: 'other',
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
