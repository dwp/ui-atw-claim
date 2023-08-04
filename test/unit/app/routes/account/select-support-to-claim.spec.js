const chai = require('chai');
const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const page = require('../../../../../app/definitions/pages/pre/select-support-to-claim');

const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
const {
  claimTypesFullName,
} = require('../../../../../app/config/claim-types');
const {
  EQUIPMENT_OR_ADAPTATION_ROOT_URL,
  SUPPORT_WORKER_ROOT_URL,
  TRAVEL_TO_WORK_ROOT_URL,
  ACCOUNT_ROOT_URL,
} = require('../../../../../app/config/uri');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
chai.use(require('sinon-chai'));

describe('/select-support-to-claim', () => {
  const moreThanYearAgoDate = new Date();
  moreThanYearAgoDate.setFullYear(moreThanYearAgoDate.getFullYear() - 2);
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 1);

  const req = new Request();
  const res = new Response(req);

  it('should be a function', () => {
    assert.typeOf(page, 'function');
  });

  it('value be a string', () => {
    assert.typeOf(page().view, 'string');
    assert.equal(page().view, 'pages/account/select-support-to-claim.njk');
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
    const setDataForPageStub = sinon.stub();
    const app = {
      endSession: endSessionStub,
      router: {
        get: sinon.stub(),
        post: sinon.stub(),
      },
    };

    describe('GET', () => {
      let sandbox;
      beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext')
          .callsFake();
      });

      afterEach(() => {
        sandbox.restore();
      });

      describe('Only 1 grantType in account', () => {
        it(claimTypesFullName.EA, async () => {
          const router = page(app);

          const setDataForPageStub = sinon.stub();
          req.casa.journeyContext = {
            setDataForPage: setDataForPageStub,
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
          req.session = {
            save: sinon.stub()
              .callsFake((cb) => {
                if (cb) {
                  cb();
                }
              }),
          };

          await router.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.statusCode, 200);

          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('__grant_being_claimed__', {
              claimType: claimTypesFullName.EA,
              id: 321,
              company: 'xyz',
              endDate: futureDate.toJSON()
                .slice(0, 10),
            });

          expect(res.redirectedTo)
            .to
            .be
            .equal(`${EQUIPMENT_OR_ADAPTATION_ROOT_URL}/specialist-equipment-claim`);
        });
        it(claimTypesFullName.SW, async () => {
          const router = page(app);

          const setDataForPageStub = sinon.stub();
          req.casa.journeyContext = {
            setDataForPage: setDataForPageStub,
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
                    },
                  ],
                },
              };
            },
          };
          req.session = {
            save: sinon.stub()
              .callsFake((cb) => {
                if (cb) {
                  cb();
                }
              }),
          };

          await router.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.statusCode, 200);

          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('__grant_being_claimed__', {
              id: 321,
              company: 'xyz',
              claimType: claimTypesFullName.SW,
              endDate: futureDate.toJSON()
                .slice(0, 10),
            });

          expect(res.redirectedTo)
            .to
            .be
            .equal(`${SUPPORT_WORKER_ROOT_URL}/support-worker-claim`);
        });
        it(claimTypesFullName.TW, async () => {
          const router = page(app);

          const setDataForPageStub = sinon.stub();
          req.casa.journeyContext = {
            setDataForPage: setDataForPageStub,
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
                    },
                  ],
                },
              };
            },
          };
          req.session = {
            save: sinon.stub()
              .callsFake((cb) => {
                if (cb) {
                  cb();
                }
              }),
          };

          await router.hooks.prerender(req, res, sinon.stub());

          assert.equal(res.statusCode, 200);

          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('__grant_being_claimed__', {
              claimType: claimTypesFullName.TW,
              id: 321,
              company: 'xyz',
              endDate: futureDate.toJSON()
                .slice(0, 10),
            });

          expect(res.redirectedTo)
            .to
            .be
            .equal(`${TRAVEL_TO_WORK_ROOT_URL}/work-travel-claim`);
        });

        it('invalid claimType', async () => {
          const router = page(app);

          req.casa.journeyContext = {
            setDataForPage: sinon.stub(),
            getDataForPage: () => {
              return {
                'account': {
                  elements: [
                    {
                      claimType: 'OTHER',
                      id: 321,
                      company: 'xyz',
                      endDate: futureDate.toJSON()
                        .slice(0, 10),
                    },
                  ],
                },
              };
            },
          };

          expect(() => router.hooks.prerender(req, res, sinon.stub()))
            .to
            .throw(Error, res.locals.t('select-support-to-claim:unsupportedGrantType') + 'OTHER');
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
                  ],
                },
              };
            },
            clearValidationErrorsForPage: sinon.stub(),
          };
          const nextStub = sinon.stub();

          router.hooks.prerender(req, res, nextStub);

          assert.equal(res.locals.hideBackButton, true);
          assert.equal(res.statusCode, 200);
          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });
        it('2 claims - 1 expired', async () => {
          const router = page(app);

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

          assert.equal(res.locals.hideBackButton, true);
          assert.equal(res.statusCode, 200);

          expect(res.redirectedTo)
            .to
            .be
            .equal(`${TRAVEL_TO_WORK_ROOT_URL}/work-travel-claim`);

        });
        it('3 claims but one has expired', async () => {
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
                    }, {
                      id: 125,
                      company: 'abc',
                      claimType: claimTypesFullName.TW,
                      endDate: moreThanYearAgoDate.toJSON()
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

          assert.equal(res.locals.hideBackButton, true);
          assert.equal(res.statusCode, 200);
          assert.deepEqual(res.locals.grants, [
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
          ]);
          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });
        it('3 claims but first two have expired', async () => {
          const router = page(app);

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
                      endDate: moreThanYearAgoDate.toJSON()
                        .slice(0, 10),
                    }, {
                      id: 125,
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

          assert.equal(res.locals.hideBackButton, true);
          assert.equal(res.statusCode, 200);

          expect(res.redirectedTo)
            .to
            .be
            .equal(`${TRAVEL_TO_WORK_ROOT_URL}/work-travel-claim`);
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

          assert.equal(res.statusCode, 200);
          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        });
      });
    });

    describe('POST', () => {
      let sandbox;
      beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext')
          .callsFake();
      });

      afterEach(() => {
        sandbox.restore();
      });

      it('submit other - redirect to exit page', async () => {
        const router = page(app);

        req.casa.journeyContext = {
          getDataForPage: () => ({
            'account': {
              elements: [
                {
                  id: 314,
                  claimType: claimTypesFullName.EA,
                  endDate: futureDate.toJSON()
                    .slice(0, 10),
                }, {
                  id: 312,
                  claimType: claimTypesFullName.TW,
                  endDate: futureDate.toJSON()
                    .slice(0, 10),
                }, {
                  id: 123,
                  claimType: claimTypesFullName.SW,
                  endDate: futureDate.toJSON()
                    .slice(0, 10),
                },
              ],
            },
            selectSupportToClaim: 'other',
          }),
        };

        router.hooks.postvalidate(req, res);

        assert.equal(res.statusCode, 200);
        expect(res.redirectedTo)
          .to
          .be
          .equal(`${ACCOUNT_ROOT_URL}/multiple-claims-exit`);
      });
      it(`${claimTypesFullName.EA} - redirect to contact-us page`, async () => {
        const router = page(app);
        req.casa.journeyOrigin = {
          originId: '',
          waypoint: '',
        };
        req.casa.journeyContext = {
          getDataForPage: () => ({
            'account': {
              elements: [
                {
                  id: 123,
                  claimType: claimTypesFullName.EA,
                  endDate: futureDate.toJSON()
                    .slice(0, 10),
                },
              ],
            },
            selectSupportToClaim: '123',
          }),
          clearValidationErrorsForPage: sinon.stub(),
          setDataForPage: setDataForPageStub,
        };

        router.hooks.postvalidate(req, res);

        assert.equal(res.statusCode, 200);
        expect(res.redirectedTo)
          .to
          .be
          .equal(`${EQUIPMENT_OR_ADAPTATION_ROOT_URL}/specialist-equipment-claim`);
      });
      it(`${claimTypesFullName.TW} - redirect to contact-us page`, async () => {
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
            selectSupportToClaim: '123',
          }),
          clearValidationErrorsForPage: sinon.stub(),
          setDataForPage: setDataForPageStub,
        };

        router.hooks.postvalidate(req, res);

        assert.equal(res.statusCode, 200);
        expect(res.redirectedTo)
          .to
          .be
          .equal(`${TRAVEL_TO_WORK_ROOT_URL}/work-travel-claim`);
      });
      it(`${claimTypesFullName.SW} - redirect to contact-us page`, async () => {
        const router = page(app);
        req.casa.journeyContext = {
          getDataForPage: () => ({
            'account': {
              elements: [
                {
                  id: 123,
                  claimType: claimTypesFullName.SW,
                },
              ],
            },
            selectSupportToClaim: '123',
          }),
          clearValidationErrorsForPage: sinon.stub(),
          setDataForPage: setDataForPageStub,
        };

        router.hooks.postvalidate(req, res);

        assert.equal(res.statusCode, 200);
        expect(res.redirectedTo)
          .to
          .be
          .equal(`${SUPPORT_WORKER_ROOT_URL}/support-worker-claim`);
      });
    });

    describe('POST - skip first page', () => {
      let sandbox;
      beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext')
          .callsFake();
      });

      afterEach(() => {
        sandbox.restore();
      });

      it('redirect to grant page when grantType is more than 1', async () => {
        const router = page(app);

        req.casa.journeyContext = {
          getDataForPage: () => ({
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
            selectSupportToClaim: 'other',
          }),
          clearValidationErrorsForPage: sinon.stub(),
          setDataForPage: setDataForPageStub,
        };

        router.hooks.postvalidate(req, res);

        assert.equal(res.statusCode, 200);
        expect(res.redirectedTo)
          .to
          .be
          .equal(`${ACCOUNT_ROOT_URL}/multiple-claims-exit`);
      });
      it(`${claimTypesFullName.EA} - redirect to worker-grant page`, async () => {
        const router = page(app);
        req.casa.journeyOrigin = {
          originId: '',
          waypoint: '',
        };
        req.casa.journeyContext = {
          getDataForPage: () => ({
            account: {
              elements: [
                {
                  id: 123,
                  claimType: claimTypesFullName.EA,
                },
                {
                  id: 312,
                  claimType: claimTypesFullName.TW,
                },
              ],
            },
            selectSupportToClaim: '123',
          }),
          clearValidationErrorsForPage: sinon.stub(),
          setDataForPage: setDataForPageStub,
        };
        req.session = {
          save: sinon.stub()
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };
        router.hooks.postvalidate(req, res);

        assert.equal(res.statusCode, 200);
        expect(res.redirectedTo)
          .to
          .be
          .equal(`${EQUIPMENT_OR_ADAPTATION_ROOT_URL}/your-specialist-equipment-grant`);
      });
      it(`${claimTypesFullName.TW} - redirect to travel-work-grant page`, async () => {
        const router = page(app);

        req.casa.journeyContext = {
          getDataForPage: () => ({
            account: {
              elements: [
                {
                  id: 321,
                  claimType: claimTypesFullName.EA,
                },
                {
                  id: 123,
                  claimType: claimTypesFullName.TW,
                },
              ],
            },
            selectSupportToClaim: '123',
          }),
          clearValidationErrorsForPage: sinon.stub(),
          setDataForPage: setDataForPageStub,
        };

        router.hooks.postvalidate(req, res);

        assert.equal(res.statusCode, 200);
        expect(res.redirectedTo)
          .to
          .be
          .equal(`${TRAVEL_TO_WORK_ROOT_URL}/your-work-travel-grant`);
      });

      it(`${claimTypesFullName.SW} - redirect to support-worker grant page`, async () => {
        const router = page(app);
        req.casa.journeyContext = {
          getDataForPage: () => ({
            account: {
              elements: [
                {
                  id: 321,
                  claimType: claimTypesFullName.EA,
                  endDate: moreThanYearAgoDate.toJSON()
                    .slice(0, 10)
                },
                {
                  id: 123,
                  claimType: claimTypesFullName.SW,
                  endDate: futureDate.toJSON()
                    .slice(0, 10)
                },
              ],
            },
            selectSupportToClaim: '123',
          }),
          clearValidationErrorsForPage: sinon.stub(),
          setDataForPage: setDataForPageStub,
        };
        req.session = {
          save: sinon.stub()
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };
        router.hooks.postvalidate(req, res);

        assert.equal(res.statusCode, 200);
        expect(res.redirectedTo)
          .to
          .be
          .equal(`${SUPPORT_WORKER_ROOT_URL}/your-support-worker-grant`);
      });
    });
  });
});
