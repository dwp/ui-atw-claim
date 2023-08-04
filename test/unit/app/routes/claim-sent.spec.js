const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');

const thankYou = require('../../../../app/routes/claim-sent');
const sinon = require('sinon');
const {
  assert,
} = require('chai');
const { claimTypesFullName } = require('../../../../app/config/claim-types');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

const endSessionStub = sinon.stub();
const app = {
  router: {
    get: sinon.stub(),
    use: sinon.stub(),
  },
  endSession: endSessionStub,
};

describe('submit-claim.router', () => {
  const req = new Request();
  const res = new Response(req);

  it('should be a function', () => {
    assert.typeOf(thankYou, 'function');
  });

  describe('use', () => {
    let sandbox;
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should set locals and render submitted page', async () => {
      const getValidationErrorsForPageStub = sinon.stub()
        .returns({});

      const setDataForPageStub = sinon.stub();

      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === 'transactionDetails') {
              return {
                claimType: 'EQUIPMENT_OR_ADAPTATION',
                claimNumber: 1,
              };
            }
            if (page === '__journey_type__') {
              return {
                journeyType: claimTypesFullName.EA,
              };
            }
            if (page === 'person-company-being-paid-payment-details') {
              return {
                someData: claimTypesFullName.EA,
              };
            }
            if (page === '__hidden_account__') {
              return {
                account: {
                  nino: 'AA370773A',
                },
              };
            }
            if (page === '__guid__') {
              return {
                guid: "GUID"
              };
            }
            return undefined;
          },
          setDataForPage: setDataForPageStub,
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };
      endSessionStub
        .resolves(Promise.resolve());

      await thankYou(app)(req, res);

      assert
        .equal(res.locals.transactionId, 'EA00000001');

      assert
        .equal(res.rendered.view,
          'pages/equipment-or-adaptation/submitted-equipment-or-adaptations.njk');
      endSessionStub
        .reset();
    });

    it('should set locals and render submitted page for support worker', async () => {
      const getValidationErrorsForPageStub = sinon.stub()
        .returns({});
      const setDataForPageStub = sinon.stub();

      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === 'transactionDetails') {
              return {
                claimType: 'SUPPORT_WORKER',
                claimNumber: 1,
              };
            }
            if (page === '__journey_type__') {
              return {
                journeyType: claimTypesFullName.SW,
              };
            }
            if (page === 'check-confirmer-details') {
              return {
                someData: claimTypesFullName.SW,
              };
            }
            if (page === '__hidden_account__') {
              return {
                account: {
                  nino: 'AA370773A',
                },
              };
            }
            if (page === '__guid__') {
              return {
                guid: "GUID"
              };
            }
            return undefined;
          },
          setDataForPage: setDataForPageStub,
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };
      endSessionStub
        .resolves(Promise.resolve());

      await thankYou(app)(req, res);

      assert
        .equal(res.locals.transactionId, 'SW00000001');

      assert
        .equal(res.rendered.view, 'pages/support-worker/submitted-support-worker.njk');

      endSessionStub
        .reset();
    });

    it('should set locals and render submitted page for Travel to work Employed', async () => {
      const getValidationErrorsForPageStub = sinon.stub()
        .returns({});
      const setDataForPageStub = sinon.stub();

      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === 'transactionDetails') {
              return {
                claimType: 'TRAVEL_TO_WORK',
                claimNumber: 1,
              };
            }
            if (page === '__journey_type__') {
              return {
                journeyType: claimTypesFullName.TW,
              };
            }
            if (page === 'check-confirmer-details') {
              return {
                someData: claimTypesFullName.TW,
              };
            }
            if (page === 'employment-status') {
              return {
                employmentStatus: 'employed',
              };
            }
            if (page === '__hidden_account__') {
              return {
                account: {
                  nino: 'AA370773A',
                },
              };
            }
            if (page === '__guid__') {
              return {
                guid: "GUID"
              };
            }
            return undefined;
          },
          setDataForPage: setDataForPageStub,
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };
      endSessionStub
        .resolves(Promise.resolve());

      await thankYou(app)(req, res);

      assert
        .equal(res.locals.transactionId, 'TW00000001');

      assert
        .equal(res.rendered.view, 'pages/travel-to-work/submitted-travel-to-work.njk');
      endSessionStub
        .reset();
    });

    it('should set locals and render submitted page for Travel to work Self Employed', async () => {
      const getValidationErrorsForPageStub = sinon.stub()
        .returns({});
      const setDataForPageStub = sinon.stub();

      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === 'transactionDetails') {
              return {
                claimType: 'TRAVEL_TO_WORK',
                claimNumber: 1,
              };
            }
            if (page === '__journey_type__') {
              return {
                journeyType: claimTypesFullName.TW,
              };
            }
            if (page === 'check-confirmer-details') {
              return {
                someData: claimTypesFullName.TW,
              };
            }
            if (page === 'employment-status') {
              return {
                employmentStatus: 'selfEmployed',
              };
            }
            if (page === '__hidden_account__') {
              return {
                account: {
                  nino: 'AA370773A',
                },
              };
            }
            if (page === '__guid__') {
              return {
                guid: "GUID"
              };
            }
            return undefined;
          },
          setDataForPage: setDataForPageStub,
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };
      endSessionStub
        .resolves(Promise.resolve());

      await thankYou(app)(req, res);

      assert
        .equal(res.locals.transactionId, 'TW00000001');

      assert
        .equal(res.rendered.view, 'pages/travel-to-work/submitted-travel-to-work.njk');
      endSessionStub
        .reset();
    });

    it(
      'should set locals and render submitted page for Travel to work Self Employed - large transaction ID',
      async () => {
        const getValidationErrorsForPageStub = sinon.stub()
          .returns({});
        const setDataForPageStub = sinon.stub();

        req.casa = {
          journeyContext: {
            getDataForPage: (page) => {
              if (page === 'transactionDetails') {
                return {
                  claimType: 'TRAVEL_TO_WORK',
                  claimNumber: 1000000001,
                };
              }
              if (page === '__journey_type__') {
                return {
                  journeyType: claimTypesFullName.TW,
                };
              }
              if (page === 'check-confirmer-details') {
                return {
                  someData: claimTypesFullName.TW,
                };
              }
              if (page === 'employment-status') {
                return {
                  employmentStatus: 'selfEmployed',
                };
              }
              if (page === '__hidden_account__') {
                return {
                  account: {
                    nino: 'AA370773A',
                  },
                };
              }
            if (page === '__guid__') {
              return {
                guid: "GUID"
              };
            }
              return undefined;
            },
            setDataForPage: setDataForPageStub,
            getValidationErrorsForPage: getValidationErrorsForPageStub,
          },
        };
        endSessionStub
          .resolves(Promise.resolve());

        await thankYou(app)(req, res);

        assert
          .equal(res.locals.transactionId, 'TW1000000001');

        assert
          .equal(res.rendered.view, 'pages/travel-to-work/submitted-travel-to-work.njk');

        endSessionStub
          .reset();
      });

    it('should redirect to /account/home if no data present', async () => {

      const setDataForPageStub = sinon.stub();


      const getValidationErrorsForPageStub = sinon.stub()
        .returns({ something: 'here' });

      req.casa = {
        journeyContext: {
          getDataForPage: () => {
            return {
              claimType: 'EQUIPMENT_OR_ADAPTATION',
              claimNumber: 1,
            }
          },
          setDataForPage: setDataForPageStub,
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };
      await thankYou(app)(req, res);
      assert.equal(res.redirectedTo, '/claim/account/home');

      sinon.assert.notCalled(setDataForPageStub);
    });
  });
});
