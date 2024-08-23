const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');

const thankYou = require('../../../../app/routes/claim-amended');
const sinon = require('sinon');
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

let assert;
(async() => {
  assert = (await import ('chai')).assert;
})();

describe('submit-amend-claim.router', () => {
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

    it('should set locals and render submitted page for support worker', async () => {
      const getValidationErrorsForPageStub = sinon.stub()
        .returns({});

      const setDataForPageStub = sinon.stub();

      req.session = {
        claimHistory: {
          awardType: claimTypesFullName.SW,
        },
        claimId:  1,
        save: sinon.stub().callsFake((cb) => {
          if (cb) {
            cb();
          }
        }),
      };

      req.casa = {
        journeyContext: {
          getDataForPage: (pageName) => {
            if (pageName === 'amend-confirmer-details') {
              return {
                someData: 'data',
              };
            }
            if (pageName === '__hidden_account__') {
              return {
                account: {
                  nino: 'AA370773A',
                },
              };
            }
            if (pageName === '__guid__') {
              return {
                guid: "GUID"
              };
            }
          },
          setDataForPage: setDataForPageStub,
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };
      endSessionStub
        .resolves(Promise.resolve());

      await thankYou(app)(req, res);

      assert.equal(res.locals.transactionId,
        `SW00000001`);

      assert.equal(res.rendered.view,
        'pages/common/amendWorkplaceContact/submitted-amended-claim.njk');

      endSessionStub
        .reset();
    });

    it('should set locals and render submitted page for Travel to work Employed', async () => {
      const getValidationErrorsForPageStub = sinon.stub()
        .returns({});

      req.session = {
        claimHistory: {
          awardType: claimTypesFullName.TW,
        },
        claimId:  1,
        save: sinon.stub().callsFake((cb) => {
          if (cb) {
            cb();
          }
        }),
      };

      const setDataForPageStub = sinon.stub();

      req.casa = {
        journeyContext: {
          getDataForPage: (pageName) => {
            if (pageName === 'amend-confirmer-details') {
              return {
                someData: 'data',
              };
            }
            if (pageName === '__hidden_account__') {
              return {
                account: {
                  nino: 'AA370773A',
                },
              };
            }
            if (pageName === '__guid__') {
              return {
                guid: "GUID"
              };
            }
          },
          setDataForPage: setDataForPageStub,
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };

      endSessionStub
        .resolves(Promise.resolve());

      await thankYou(app)(req, res);

      assert
        .equal(res.locals.transactionId,
          `TW00000001`);

      assert.equal(res.rendered.view,
        'pages/common/amendWorkplaceContact/submitted-amended-claim.njk');

      endSessionStub.reset();
    });

    it('should redirect to / if no data present', async () => {
      const getDataForPageStub = sinon
        .stub()
        .returns({
          claimType: 'EQUIPMENT_OR_ADAPTATION',
          claimNumber: 1,
        });

      const getValidationErrorsForPageStub = sinon.stub()
        .returns({ something: 'here' });

      req.casa = {
        journeyContext: {
          getDataForPage: getDataForPageStub,
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };
      await thankYou(app)(req, res);
      assert.equal(res.redirectedTo, '/claim/account/home');
    });


    it('should set locals and render amend screen for (CS Amend rejected)', async () => {

      const getValidationErrorsForPageStub = sinon.stub()
        .returns({});

      req.session = {
        claimHistory: {
          awardType: claimTypesFullName.TW,
        },
        claimId:  2,
        save: sinon.stub().callsFake((cb) => {
          if (cb) {
            cb();
          }
        }),
      };

      const setDataForPageStub = sinon.stub();

      req.casa = {
        journeyContext: {
          getDataForPage: (pageName) => {
            if (pageName === 'transactionDetails') {
              return {
                claimType: 'TRAVEL_TO_WORK',
                claimNumber: 22,
              };
            }else if (pageName === 'check-your-answers') {
              return {
                someData: 'data',
              };
            }
            else if (pageName === '__hidden_account__') {
              return {
                account: {
                  nino: 'AA370773A',
                },
              };
            }
            else if (pageName === '__previous_claim__') {
              return {
                someData: "dasda"
              };
            }
            else if (pageName === '__guid__') {
              return {
                guid: "GUID"
              };
            }
          },
          setDataForPage: setDataForPageStub,
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };

      endSessionStub
        .resolves(Promise.resolve());

      await thankYou(app)(req, res);
      assert.equal(res.rendered.view,
        'pages/common/amendWorkplaceContact/submitted-amended-claim.njk');


      assert
        .equal(res.locals.transactionId,
          `TW00000022`);


      endSessionStub.reset();
    });
  });
});
