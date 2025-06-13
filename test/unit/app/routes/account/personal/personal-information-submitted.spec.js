const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');

const submitted = require(
  '../../../../../../app/routes/account/personal/personal-information-submitted');
const sinon = require('sinon');
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
(async () => {
  assert = (await import('chai')).assert;
})();

describe('/personal-information-submitted', () => {
  const req = new Request();
  const res = new Response(req);

  it('should be a function', () => {
    assert.typeOf(submitted, 'function');
  });

  describe('use', () => {
    it('should set locals and render submitted page', async () => {
      const getValidationErrorsForPageStub = sinon.stub()
        .returns({});

      const sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();

      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === 'change-personal-details') {
              return {
                reviewed: true,
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
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };
      endSessionStub
        .resolves(Promise.resolve());

      await submitted(app)(req, res);

      assert
        .equal(res.rendered.view,
          'pages/account/personal/personal-information-submitted.njk');

      sandbox.restore();

      endSessionStub
        .reset();

    });

    it('missing required fields so redirect to home', async () => {
      const getValidationErrorsForPageStub = sinon.stub()
        .returns({ something: 'here' });

      req.casa = {
        journeyContext: {
          getDataForPage: () => {
            return undefined;
          },
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };
      endSessionStub
        .resolves(Promise.resolve());

      await submitted(app)(req, res);

      assert.equal(res.redirectedTo, '/claim/account/home');

      endSessionStub
        .reset();
    });

    it('should change page lang correctly', async () => {

      const getValidationErrorsForPageStub = sinon.stub()
      .returns({ something: 'here' });

      const getDataForPageStub = sinon.stub()
      .returns({
        currentUrl: 'claim/personal/personal-details-submitted?&lang=en'
      });

    req.casa = {
      journeyContext: {
        getDataForPage: getDataForPageStub,
        getValidationErrorsForPage: getValidationErrorsForPageStub,
      },
    };
    
    res.locals = {
        currentUrl: 'claim/personal/personal-details-submitted?&lang=en',
        casa: sinon.stub(),
        t:  sinon.stub(),
        BUTTON_TEXT: 'common:returnToPersonalInformationHome',
        noNextButton: true
    }

    endSessionStub
      .resolves(Promise.resolve());

    await submitted(app)(req, res);

    assert
    .equal(res.rendered.view,
      'pages/account/personal/personal-information-submitted.njk');

    endSessionStub
      .reset();
    });
  });
});
