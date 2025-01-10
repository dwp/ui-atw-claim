const rewire = require('rewire');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');

const declaration = rewire(
  '../../../../../../app/routes/account/personal/new-personal-declaration');
const sinon = require('sinon');


const axiosStub = sinon.stub();

declaration.__set__('axios', axiosStub);
const getValidationErrorsForPageStub = sinon.stub()
  .returns({});

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

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('new-personal-declaration', () => {
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
      router.newPersonalDeclarationGet(req, res, 1.0);
      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/problem-with-service');
    });

    it('if journey is complete should render page', () => {
      req.casa = {
        journeyContext: {
          getDataForPage: () => {
            return { somethings: 'here' };
          },
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };

      const router = declaration(app, fakeCsrf);
      router.newPersonalDeclarationGet(req, res, 1.0);
      expect(res.rendered.view)
        .to
        .be
        .equal('pages/account/personal/declaration/1.0/new-personal-declaration.njk');
      expect(res.locals.casa.journeyPreviousUrl)
        .to
        .be
        .equal('/claim/personal/change-personal-details');
      expect(res.locals.noNextButton)
        .to
        .be
        .equal(true);
    });

    it('return error if on DECLARATION_VERSION is undefined', () => {
      req.casa = {
        journeyContext: {
          getDataForPage: () => {
            return { somethings: 'here' };
          },
          getValidationErrorsForPage: getValidationErrorsForPageStub,
        },
      };

      const router = declaration(app, fakeCsrf);

      expect(() => router.newPersonalDeclarationGet(req, res, undefined))
        .to
        .throw('Declaration version undefined not supported');
    });

  });

  describe('declaration - post', () => {
    const app = {
      router: {
        get: sinon.stub(),
        post: sinon.stub(),
      },
    };

    const req = new Request();
    const res = new Response(req);
    const fakeCsrf = 'fake';
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

    it('if successfully submitted, redirect to /submitted', async () => {
      const router = declaration(app, fakeCsrf);
      req.casa.journeyContext.data = {
        __hidden_account__: { account },
        'update-name': {
          firstName: 'first',
          lastName: 'last',
        },
        'update-your-email-address': {
          emailAddress: 'email@email.com',
        },
        'new-phone-number': {
          homeNumber: '02089073124',
        },
        'new-mobile-number': {
          mobileNumber: '07543841490',
        },
        __hidden_address__: {
          addressDetails: {
            address1: 'address1',
            address2: 'address2',
            address3: 'address3',
            address4: 'address4',
            postcode: 'NE264RS',
          },
        },
      };

      res.locals.origin = 'en';

      axiosStub.resolves(Promise.resolve({
        status: 201,
      }));
      await router.newPersonalDeclarationPost(req, res, 1.0);

      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/personal/personal-details-submitted');
      axiosStub.reset();
    });

    it('error when success but wrong status', async () => {
      const router = declaration(app, fakeCsrf);
      req.casa.journeyContext.data = {
        __hidden_account__: { account },
        'update-name': {
          firstName: 'first',
          lastName: 'last',
        },
        'update-your-email-address': {
          emailAddress: 'email@email.com',
        },
        'new-phone-number': {
          homeNumber: '02089073124',
        },
        'new-mobile-number': {
          mobileNumber: '07543841490',
        },
        __hidden_address__: {
          addressDetails: {
            address1: 'address1',
            address2: 'address2',
            address3: 'address3',
            address4: 'address4',
            postcode: 'NE264RS',
          },
        },
      };

      res.locals.origin = 'en';

      axiosStub.resolves(Promise.resolve({
        status: 200,
      }));
      await router.newPersonalDeclarationPost(req, res, 1.0);

      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/problem-with-service');
      axiosStub.reset();
    });

    it('error returned from Axios', async () => {
      const router = declaration(app, fakeCsrf);
      req.casa.journeyContext.data = {
        __hidden_account__: { account },
        'update-name': {
          firstName: 'first',
          lastName: 'last',
        },
        'update-your-email-address': {
          emailAddress: 'email@email.com',
        },
        'new-phone-number': {
          homeNumber: '02089073124',
        },
        'new-mobile-number': {
          mobileNumber: '07543841490',
        },
        __hidden_address__: {
          addressDetails: {
            address1: 'address1',
            address2: 'address2',
            address3: 'address3',
            address4: 'address4',
            postcode: 'NE264RS',
          },
        },
      };

      res.locals.origin = 'en';

      axiosStub.resolves(Promise.reject({ response: 'error' }));

      await router.newPersonalDeclarationPost(req, res, 1.0);

      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/problem-with-service');
      axiosStub.reset();
    });
  });
});
