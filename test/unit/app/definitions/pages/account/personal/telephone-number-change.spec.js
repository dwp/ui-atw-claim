const chai = require('chai');
const sinon = require('sinon');
const page = require(
  '../../../../../../../app/definitions/pages/account/personal/telephone-number-change',
);
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');

const {
  assert,
  expect,
} = chai;

const getAccountData = () => ({
  atwNumber: 'ATW123456789',
  nino: 'AA370773A',
  claimant: {
    forename: 'John',
    surname: 'Smith',
    dateOfBirth: '1994-11-22',
    email: 'john.smith@gmail.com',
    homeNumber: '02089073124',
    mobileNumber: '07700900982',
    address: {
      address1: '1 High Street',
      address2: 'Village Name',
      address3: 'Town',
      address4: 'County',
      postcode: 'NE26 4RS',
    },
  },
});

const setupGetDataForPageFunction = (accountData = getAccountData()) => (pageName) => {
  if (pageName === '__hidden_account__') {
    return { account: getAccountData() };
  } if (pageName === 'update-name') {
    return {
      firstName: accountData.claimant.forename,
      lastName: accountData.claimant.surname,
    };
  } if (pageName === 'update-your-email-address') {
    return { emailAddress: accountData.claimant.email };
  } if (pageName === 'new-phone-number') {
    return { homeNumber: accountData.claimant.homeNumber };
  } if (pageName === 'new-mobile-number') {
    return { mobileNumber: accountData.claimant.mobileNumber };
  } if (pageName === '__hidden_address__') {
    return {
      addressDetails: accountData.claimant.address,
    };
  }
};

describe('definitions/pages/account/personal/telephone-number-change', () => {
  it('should export a function', () => {
    assert.typeOf(page, 'function');
  });

  describe('when exported function is invoked', () => {
    beforeEach(() => {
      this.result = page();
    });

    it('returns an object', () => {
      assert.typeOf(this.result, 'object');
    });

    describe('returned object keys', () => {
      describe('`view` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('view');
        });

        it('should contain path to the template', () => {
          assert.typeOf(this.result.view, 'string');
          assert.equal(
            this.result.view,
            'pages/account/personal/telephone-number-change.njk',
          );
        });
      });

      describe('`prerender` key', () => {
        let req;
        let res;
        let accountData;

        beforeEach(() => {
          req = new Request();
          res = new Response(req);
          accountData = getAccountData();
        });

        it('should be defined in the `hooks` key', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');
        });

        it('should hide continue button if no fields have changes', () => {
          req.casa = {
            journeyOrigin: 'personal',
            plan: {
              traverse: sinon.stub()
                .returns(['test-page-2', 'test-page-3']),
            },
            journeyContext: {
              getData: sinon.stub(),
              getValidationErrors: sinon.stub(),
              getDataForPage: setupGetDataForPageFunction(),
            },
          };

          this.result.hooks.prerender(req, res, sinon.stub());
          assert.equal(res.locals.hideContinueButton, true);
        });

        it('should show continue button when some fields have changes', () => {
          accountData.claimant.homeNumber = '02089078888';

          req.headers = {
            referer: 'http://somehost/claim/personal/new-phone-number?edit=&editorigin=/claim/personal/personal-information-change',
          };
          req.casa = {
            journeyOrigin: 'personal',
            plan: {
              traverse: sinon.stub()
                .returns(['test-page-2', 'test-page-3']),
            },
            journeyContext: {
              getData: sinon.stub(),
              getValidationErrors: sinon.stub(),
              getDataForPage: setupGetDataForPageFunction(accountData),
            },
          };
          this.result.hooks.prerender(req, res, sinon.stub());
          assert.equal(res.locals.hideContinueButton, false);
        });
      });
    });
  });
});
