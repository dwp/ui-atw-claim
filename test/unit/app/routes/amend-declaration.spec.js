const rewire = require('rewire');

const declaration = rewire('../../../../app/routes/amend-declaration');
const sinon = require('sinon');
const { claimTypesFullName } = require('../../../../app/config/claim-types');
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');

const axiosStub = sinon.stub();
const formatClaimDataStub = sinon.stub();
const mapClaimDataStub = sinon.stub();
const getValidationErrorsForPageStub = sinon.stub()
  .returns({});

  let chai, chaiAsPromised, assert, expect, sinonChai;
  (async() => {
    chai = await import ('chai');
    assert = (await import ('chai')).assert;
    expect = (await import ('chai')).expect;
    chai = await import ('chai');
chai.use(require('sinon-chai'));
  })();

declaration.__set__('formatClaimData', formatClaimDataStub.returns({ claimData: 'data' }));
declaration.__set__('axios', axiosStub);
declaration.__set__('mapClaimData', mapClaimDataStub);

describe('Declaration', () => {
  it('should return a function', () => {
    expect(typeof declaration)
      .to
      .be
      .equal('function');
  });

  describe('declaration - get', () => {
    const app = {
      router: {
        get: sinon.stub(),
        post: sinon.stub(),
      },
    };

    const req = new Request();
    const res = new Response(req);
    const fakeCsrf = 'fake';
    const getDataForPageStub = sinon.stub();

    req.casa = {
      journeyContext: {
        getDataForPage: getDataForPageStub,
        getValidationErrorsForPage: getValidationErrorsForPageStub,
      },
    };

    it('if journey is not complete should redirect to default', () => {
      const router = declaration(app, fakeCsrf);
      getDataForPageStub.returns({});
      router.declarationGet(req, res, 1.0);
      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/account/home');
    });

    it('if journey is complete should render to declaration with SW backlink', () => {
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__journey_type__') {
              return {
                journeyType: claimTypesFullName.SW,
              };
            }
            return { somethings: 'here' };
          },
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };

      const router = declaration(app, fakeCsrf);
      router.declarationGet(req, res, 1.0);
      expect(res.rendered.view)
        .to
        .be
        .equal('pages/common/declaration/1.0/declaration.njk');
      expect(res.locals.casa.journeyPreviousUrl)
        .to
        .be
        .equal('/claim/amend-workplace-contact/amend-check-confirmer-details');
      expect(res.locals.noNextButton)
        .to
        .be
        .equal(true);
    });

    it('if journey is complete should render to declaration with TW backlink', () => {
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__journey_type__') {
              return {
                journeyType: claimTypesFullName.TW,
              };
            }
            return { somethings: 'here' };
          },
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };

      const router = declaration(app, fakeCsrf);
      router.declarationGet(req, res, 1.0);
      expect(res.rendered.view)
        .to
        .be
        .equal('pages/common/declaration/1.0/declaration.njk');
      expect(res.locals.casa.journeyPreviousUrl)
        .to
        .be
        .equal('/claim/amend-workplace-contact/amend-check-confirmer-details');
      expect(res.locals.noNextButton)
        .to
        .be
        .equal(true);
    });

    it('return error if on DECLARATION_VERSION is undefined', () => {
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__journey_type__') {
              return {
                journeyType: claimTypesFullName.TW,
              };
            }
            return { somethings: 'here' };
          },
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };

      const router = declaration(app, fakeCsrf);

      expect(() => router.declarationGet(req, res, undefined))
        .to
        .throw('Declaration version undefined not supported');
    });

    it('return error if on DECLARATION_VERSION is 2.0', () => {
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__journey_type__') {
              return {
                journeyType: claimTypesFullName.TW,
              };
            }
            return { somethings: 'here' };
          },
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };

      const router = declaration(app, fakeCsrf);

      expect(() => router.declarationGet(req, res, 2.0))
        .to
        .throw('Declaration version 2 not supported');
    });
  });

  describe('amend-declaration - put', () => {
    const app = {
      router: {
        get: sinon.stub(),
        post: sinon.stub(),
      },
    };

    const req = new Request();
    const res = new Response(req);
    const fakeCsrf = 'fake';
    const getDataForPageStub = sinon.stub();
    const setDataForPageStub = sinon.stub();

    req.casa = {
      journeyContext: {
        toObject: sinon.stub()
          .returns({}),
        getDataForPage: getDataForPageStub,
        setDataForPage: setDataForPageStub,
        getValidationErrorsForPage: getValidationErrorsForPageStub,
      },
    };

    it('if successfully submitted, redirect to /claim-amended (SW)', async () => {
      const router = declaration(app, fakeCsrf);
      res.locals.origin = 'en';

      const expectedResponse = {
        status: 204,
      };

      req.session = {
        claimHistory: {
          awardType: claimTypesFullName.SW,
        },
      };

      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === 'amend-confirmer-details') {
              return {
                fullName: 'Name',
                emailAddress: 'email@email.com',
              };
            }
            if (page === '__hidden_account__') {
              return {
                account: {
                  nino: 'AA370773A',
                },
              };
            }
          },
        },
      };

      axiosStub.resolves(Promise.resolve(expectedResponse));

      await router.declarationPut(req, res, 1.0);

      assert.equal(req.session.claimHistory.awardType, claimTypesFullName.SW);

      expect(req.sessionSaved)
        .to
        .be
        .equal(false);
      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/claim-amended');
      axiosStub.reset();
    });

    it('if unsuccessfully submitted, redirect to /problem-with-service (SW)', async () => {
      const router = declaration(app, fakeCsrf);
      res.locals.origin = 'en';

      const expectedResponse = {
        status: 400,
      };

      req.session = {
        claimHistory: {
          awardType: claimTypesFullName.SW,
        },
      };

      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === 'amend-confirmer-details') {
              return {
                fullName: 'Name',
                emailAddress: 'email@email.com',
              };
            }
            if (page === '__hidden_account__') {
              return {
                account: {
                  nino: 'AA370773A',
                },
              };
            }          },
        },
      };

      axiosStub.resolves(Promise.resolve(expectedResponse));

      await router.declarationPut(req, res, 1.0);

      assert.equal(req.session.claimHistory.awardType, claimTypesFullName.SW);

      expect(req.sessionSaved)
        .to
        .be
        .equal(false);
      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/problem-with-service');
      axiosStub.reset();
    });

    it('if supported journeyType provided fail to submit', async () => {
      const router = declaration(app, fakeCsrf);
      req.casa.journeyContext.data = {
        __journey_type__: {
          journeyType: 'OTHER',
        },
      };
      res.locals.origin = 'en';

      expect(router.declarationPut(req, res, 1.0)).to.eventually.be.rejected;
    });

    it('if log an error and redirect to /problem-with-service '
      + 'if the API call fails', async () => {
      const router = declaration(app, fakeCsrf);

      req.casa.journeyContext.data = {
        __journey_type__: {
          journeyType: claimTypesFullName.SW,
        },
      };
      res.locals.origin = 'en';
      axiosStub.resolves(Promise.reject({ message: 'API error' }));
      try {
        await router.declarationPut(req, res, 1.0);
      } catch (error) {
        expect(res.redirectedTo)
          .to
          .be
          .equal('/problem-with-service');
      }
      axiosStub.reset();
    });

    it('return error if on DECLARATION_VERSION is undefined', async () => {
      const router = declaration(app, fakeCsrf);

      try {
        await router.declarationPut(req, res, undefined);
        assert.fail('Oh no the exception not thrown');
      } catch (e) {
        expect(e.message)
          .to
          .be
          .equal('Declaration version not defined');
      }
    });
  });
});
