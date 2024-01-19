const rewire = require('rewire');
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');

const declaration = rewire('../../../../app/routes/declaration');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { claimTypesFullName } = require('../../../../app/config/claim-types');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

chai.use(chaiAsPromised);

const {
  expect,
  assert,
} = chai;
chai.use(require('sinon-chai'));

const axiosStub = sinon.stub();
const formatClaimDataStub = sinon.stub();
const mapClaimDataStub = sinon.stub();
const getValidationErrorsForPageStub = sinon.stub()
  .returns({});

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
    const req = new Request();
    const res = new Response(req);
    const getDataForPageStub = sinon.stub();

    req.casa = {
      journeyContext: {
        getDataForPage: getDataForPageStub,
        getValidationErrorsForPage: getValidationErrorsForPageStub,
      },
    };

    it('if journey is not complete should redirect to default', () => {
      const router = declaration();
      getDataForPageStub.returns({});
      router.declarationGet(req, res, 1.0);
      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/problem-with-service');
    });

    it('if journey is complete should render to declaration with EA backlink', () => {
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__journey_type__') {
              return {
                journeyType: claimTypesFullName.EA,
              };
            }
            return { somethings: 'here' };
          },
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };

      const router = declaration();
      router.declarationGet(req, res, 1.0);
      expect(res.rendered.view)
        .to
        .be
        .equal('pages/common/declaration/1.0/declaration.njk');
      expect(res.locals.howDidYouTravelForWork)
        .to
        .be
        .equal(undefined)
      expect(res.locals.casa.journeyPreviousUrl)
        .to
        .be
        .equal('/claim/specialist-equipment/check-your-answers');
      expect(res.locals.noNextButton)
        .to
        .be
        .equal(true);
    });

    it('if journey is complete should render to declaration with AV backlink', () => {
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__journey_type__') {
              return {
                journeyType: claimTypesFullName.AV,
              };
            }
            return { somethings: 'here' };
          },
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };

      const router = declaration();
      router.declarationGet(req, res, 1.0);
      expect(res.rendered.view)
        .to
        .be
        .equal('pages/common/declaration/1.0/declaration.njk');
      expect(res.locals.howDidYouTravelForWork)
        .to
        .be
        .equal(undefined)
      expect(res.locals.casa.journeyPreviousUrl)
        .to
        .be
        .equal('/claim/vehicle-adaptations/check-your-answers');
      expect(res.locals.noNextButton)
        .to
        .be
        .equal(true);
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

      const router = declaration();
      router.declarationGet(req, res, 1.0);
      expect(res.rendered.view)
        .to
        .be
        .equal('pages/common/declaration/1.0/declaration.njk');
      expect(res.locals.howDidYouTravelForWork)
        .to
        .be
        .equal(undefined)
      expect(res.locals.casa.journeyPreviousUrl)
        .to
        .be
        .equal('/claim/support-worker/check-your-answers');
      expect(res.locals.noNextButton)
        .to
        .be
        .equal(true);
    });

    it('if journey is complete should render to declaration with TW backlink and lift travel to work', () => {
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__journey_type__') {
              return {
                journeyType: claimTypesFullName.TW,
              };
            }
            if(page === 'which-journey-type') {
              return {
                howDidYouTravelForWork: "lift",
              };
            }
            return { somethings: 'here' };
          },
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };

      const router = declaration();
      router.declarationGet(req, res, 1.0);
      expect(res.rendered.view)
        .to
        .be
        .equal('pages/common/declaration/1.0/declaration.njk');
      expect(res.locals.howDidYouTravelForWork)
        .to
        .be
        .equal("lift")
      expect(res.locals.casa.journeyPreviousUrl)
        .to
        .be
        .equal('/claim/travel-to-work/check-your-answers');
      expect(res.locals.noNextButton)
        .to
        .be
        .equal(true);
    });

    it('if journey is complete should render to declaration with TW backlink and taxi travel to work', () => {
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__journey_type__') {
              return {
                journeyType: claimTypesFullName.TW,
              };
            }
            if(page === 'which-journey-type') {
              return {
                howDidYouTravelForWork: "taxi",
              };
            }
            return { somethings: 'here' };
          },
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };

      const router = declaration();
      router.declarationGet(req, res, 1.0);
      expect(res.rendered.view)
        .to
        .be
        .equal('pages/common/declaration/1.0/declaration.njk');
      expect(res.locals.howDidYouTravelForWork)
        .to
        .be
        .equal("taxi")
      expect(res.locals.casa.journeyPreviousUrl)
        .to
        .be
        .equal('/claim/travel-to-work/check-your-answers');
      expect(res.locals.noNextButton)
        .to
        .be
        .equal(true);
    });

    it('return error if on journeyType that is not implemented', () => {
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === '__journey_type__') {
              return {
                journeyType: 'TIW',
              };
            }
            return { somethings: 'here' };
          },
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };

      const router = declaration();

      expect(() => router.declarationGet(req, res, 1.0))
        .to
        .throw('Unsupported journeyType for back link');
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

      const router = declaration();

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

      const router = declaration();

      expect(() => router.declarationGet(req, res, 2.0))
        .to
        .throw('Declaration version 2 not supported');
    });
  });

  describe('declaration - post', () => {
    const req = new Request();
    const res = new Response(req);
    const getDataForPageStub = sinon.stub()
      .returns();
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
    const account = {
      atwNumber: 'ATW123456789',
      nino: 'AA370773A',
      claimant: {
        forename: 'John',
        surname: 'Smith',
        dateOfBirth: '1994-11-22',
        email: 'john.smith@gmail.com',
        mobileNumber: '07700900982',
        address: {
          address1: '1 High Street',
          address2: 'Village Name',
          address3: 'Town',
          address4: 'County',
          postcode: 'NE26 4RS',
        },
      },
    };

    let sandbox;

    afterEach(() => {
      sandbox.restore();
    })

    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();
      axiosStub.reset();
    });

    it('if successfully submitted, redirect to /submitted (EA)', async () => {
      const router = declaration();
      req.casa.journeyContext.data = {
        __hidden_account__: { account },
        __grant_being_claimed__: {
          company: 'The Company',
          nonAtwCost: 100,
        },
        __journey_type__: {
          journeyType: claimTypesFullName.EA,
        },
      };

      res.locals.origin = 'en';
      const expectedResponse = {
        data: {
          claimType: 'EQUIPMENT_OR_ADAPTATION',
          claimNumber: 1,
        },
      };

      axiosStub.resolves(Promise.resolve(expectedResponse));
      await router.declarationPost(req, res, 1.0);
      expect(setDataForPageStub)
        .to
        .be
        .calledWith('transactionDetails', {
          claimType: 'EQUIPMENT_OR_ADAPTATION',
          claimNumber: 1,
        });
      expect(req.sessionSaved)
        .to
        .be
        .equal(true);
      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/claim-submitted');

    });

    it('if successfully submitted, redirect to /submitted (AV)', async () => {
      const router = declaration();
      req.casa.journeyContext.data = {
        __hidden_account__: { account },
        __grant_being_claimed__: {
          company: 'The Company',
          nonAtwCost: 100,
        },
        __journey_type__: {
          journeyType: claimTypesFullName.AV,
        },
      };

      res.locals.origin = 'en';
      const expectedResponse = {
        data: {
          claimType: 'ADAPTATION_TO_VEHICLE',
          claimNumber: 1,
        },
      };

      axiosStub.resolves(Promise.resolve(expectedResponse));
      await router.declarationPost(req, res, 1.0);
      expect(setDataForPageStub)
        .to
        .be
        .calledWith('transactionDetails', {
          claimType: 'ADAPTATION_TO_VEHICLE',
          claimNumber: 1,
        });
      expect(req.sessionSaved)
        .to
        .be
        .equal(true);
      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/claim-submitted');

    });

    it('if successfully submitted, redirect to /submitted (SW)', async () => {
      const router = declaration();
      req.casa.journeyContext.data = {
        __hidden_account__: { account },
        __grant_being_claimed__: {
          company: 'The Company',
          nonAtwCost: 0,

        },
        __journey_type__: {
          journeyType: claimTypesFullName.SW,
        },
      };

      res.locals.origin = 'en';
      const expectedResponse = {
        data: {
          claimType: 'SUPPORT_WORKER',
          claimNumber: 1,
        },
      };

      axiosStub.resolves(Promise.resolve(expectedResponse));
      await router.declarationPost(req, res, 1.0);

      expect(axiosStub).to.be.calledOnceWithExactly({
        method: 'post',
        url: '/submit',
        baseURL: 'http://localhost:9014',
        headers: { 'Content-Type': 'application/json' },
        data: {
          nino: 'AA370773A',
          claimType: 'SUPPORT_WORKER',
          declarationVersion: 1,
          journeyContext: {},
          atwNumber: 'ATW123456789',
          hasContributions: false,
          claimant: {
            forename: 'John',
            surname: 'Smith',
            dateOfBirth: '1994-11-22',
            emailAddress: 'john.smith@gmail.com',
            homeNumber: undefined,
            mobileNumber: '07700900982',
            company: 'The Company',
            address: {
              address1: '1 High Street',
              address2: 'Village Name',
              address3: 'Town',
              address4: 'County',
              postcode: 'NE26 4RS',
            },
          }
        }
      } );


      expect(setDataForPageStub)
        .to
        .be
        .calledWith('transactionDetails', {
          claimType: 'SUPPORT_WORKER',
          claimNumber: 1,
        });
      expect(req.sessionSaved)
        .to
        .be
        .equal(true);
      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/claim-submitted');

    });

    it('if successfully submitted, redirect to /submitted (TW)', async () => {
      const router = declaration();
      req.casa.journeyContext.data = {
        __hidden_account__: { account },
        __grant_being_claimed__: {
          company: 'The Company',
        },
        __journey_type__: {
          journeyType: claimTypesFullName.TW,
        },
      };

      res.locals.origin = 'en';
      const expectedResponse = {
        data: {
          claimType: 'TRAVEL_TO_WORK',
          claimNumber: 1,
        },
      };

      axiosStub.resolves(Promise.resolve(expectedResponse));
      await router.declarationPost(req, res, 1.0);

        expect(setDataForPageStub)
        .to
        .be
        .calledWith('transactionDetails', {
          claimType: 'TRAVEL_TO_WORK',
          claimNumber: 1,
        });

      expect(axiosStub).to.be.calledOnceWithExactly({
          method: 'post',
          url: '/submit',
          baseURL: 'http://localhost:9014',
          headers: { 'Content-Type': 'application/json' },
          data: {
            nino: 'AA370773A',
            claimType: 'TRAVEL_TO_WORK',
            declarationVersion: 1,
            journeyContext: {},
            atwNumber: 'ATW123456789',
            hasContributions: false,
            claimant: {
              forename: 'John',
              surname: 'Smith',
              dateOfBirth: '1994-11-22',
              emailAddress: 'john.smith@gmail.com',
              homeNumber: undefined,
              mobileNumber: '07700900982',
              company: 'The Company',
              address: {
                address1: '1 High Street',
                address2: 'Village Name',
                address3: 'Town',
                address4: 'County',
                postcode: 'NE26 4RS',
              },
            }
          }
        }
      );

      expect(req.sessionSaved)
        .to
        .be
        .equal(true);
      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/claim-submitted');

    });

    it('if successfully submitted, redirect to /claim-amended', async () => {
      const router = declaration();
      req.casa.journeyContext.data = {
        __previous_claim__: {
          claimId: 1,
          claimType: claimTypesFullName.TW,
        },
        __hidden_account__: { account },
        __grant_being_claimed__: {
          company: 'The Company',
          nonAtwCost: 100,
        },
        __journey_type__: {
          journeyType: claimTypesFullName.TW,
        },
      };

      res.locals.origin = 'en';
      const expectedResponse = {
        data: {
          claimType: 'TRAVEL_TO_WORK',
          claimNumber: 1,
        },
      };

      axiosStub.resolves(Promise.resolve(expectedResponse));
      await router.declarationPost(req, res, 1.0);
      expect(setDataForPageStub)
        .to
        .be
        .calledWith('transactionDetails', {
          claimType: 'TRAVEL_TO_WORK',
          claimNumber: 1,
        });
      expect(req.sessionSaved)
        .to
        .be
        .equal(true);
      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/claim-amended');

    });

    it('if supported journeyType provided fail to submit', async () => {
      const router = declaration();
      req.casa.journeyContext.data = {
        __hidden_account__: { account },
        __grant_being_claimed__: {
          company: 'The Company',
          nonAtwCost: 100,
        },
        __journey_type__: {
          journeyType: 'OTHER',
        },
      };
      res.locals.origin = 'en';

      expect(router.declarationPost(req, res, 1.0)).to.eventually.be.rejected;
    });

    it('if log an error and redirect to /problem-with-service '
      + 'if the API call fails', async () => {
      const router = declaration();

      req.casa.journeyContext.data = {
        __hidden_account__: { account },
        __grant_being_claimed__: {
          company: 'The Company',
          nonAtwCost: 100,
        },
        __journey_type__: {
          journeyType: claimTypesFullName.EA,
        },
      };
      res.locals.origin = 'en';
      axiosStub.resolves(Promise.reject({ message: 'API error' }));
      try {
        await router.declarationPost(req, res, 1.0);
      } catch (error) {
        expect(res.redirectedTo)
          .to
          .be
          .equal('/problem-with-service');
      }

    });

    it('return error if on DECLARATION_VERSION is undefined', async () => {
      const router = declaration();

      try {
        await router.declarationPost(req, res, undefined);
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
