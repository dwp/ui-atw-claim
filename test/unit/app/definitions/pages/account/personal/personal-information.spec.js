const page = require(
  '../../../../../../../app/definitions/pages/account/personal/personal-information');
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');
const sinon = require('sinon');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

let assert, expect;

(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
})();

const account = {
  atwNumber: 'ATW123456789',
  nino: 'AA370773A',
  claimant: {
    forename: 'John',
    surname: 'Smith',
    dateOfBirth: '1994-11-22',
    email: 'john.smith@gmail.com',
    homeNumber: '02089078888',
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

describe('definitions/pages/account/personal/personal-information', () => {
  const req = new Request();
  const res = new Response(req);

  it('should page a function', () => {
    assert.typeOf(page, 'function');
  });
  describe('when exported function is invoked', () => {
    beforeEach(() => {
      this.result = page();
    });
    it('when exported function is invoked', () => {
      assert.typeOf(this.result, 'object');
    });

    describe('returned object keys', () => {
      describe('`view` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('view');
        });
        it('value be a string', () => {
          assert.typeOf(this.result.view, 'string');
          assert.equal(this.result.view, 'pages/account/personal/personal-information.njk');
        });
      });
    });
    describe('`prerender` key', () => {
      it('should be defined', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prerender');
      });

      it('check res.local', () => {
        const nextStub = sinon.stub();

        req.casa = {
          journeyContext: {
            getDataForPage: (pageName) => {
              if (pageName === '__hidden_account__') {
                return {
                  account,
                };
              }
            },
          },
        };

        this.result.hooks.prerender(req, res, nextStub);

        assert.equal(res.locals.BUTTON_TEXT, 'personal-information:button');

        assert.equal(res.locals.forename, 'John');
        assert.equal(res.locals.surname, 'Smith');
        assert.equal(res.locals.homeNumber, '02089078888');
        assert.equal(res.locals.mobileNumber, '07700900982');
        assert.equal(res.locals.email, 'john.smith@gmail.com');

        expect(res.locals.address)
          .to
          .deep
          .equal({
            address1: '1 High Street',
            address2: 'Village Name',
            address3: 'Town',
            address4: 'County',
            postcode: 'NE26 4RS',
          });
      });
    });
    describe('`preredirect`', () => {
      it('populate data', () => {
        const sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').callsFake();
        const setDataForPageStuff = sinon.stub();
        const clearValidationErrorsForPage = sinon.stub();

        req.casa = {
          journeyContext: {
            setDataForPage: setDataForPageStuff,
            clearValidationErrorsForPage: clearValidationErrorsForPage,
            getDataForPage: (pageName) => {
              {
                if (pageName === '__hidden_account__') {
                  return { account };
                } else if (pageName === 'update-name') {
                  return {
                    firstName: 'first',
                    lastName: 'last',
                  };
                } else if (pageName === 'update-your-email-address') {
                  return { emailAddress: 'email@email.com' };
                } else if (pageName === 'new-phone-number') {
                  return { homeNumber: '02089071234' };
                } else if (pageName === 'new-mobile-number') {
                  return { homeNumber: '07543841490' };
                } else if (pageName === '__hidden_address__') {
                  return {
                    addressDetails: {
                      address1: 'address1',
                      address2: 'address2',
                      address3: 'address3',
                      address4: 'address4',
                      postcode: 'NE264RS',
                    },
                  };
                }
              }
            },
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

        this.result.hooks.preredirect(req, res);

        expect(res.redirectedTo)
          .to
          .be
          .equal('/claim/personal/change-personal-details');

        sinon.assert.callCount(setDataForPageStuff, 6);
        sinon.assert.callCount(clearValidationErrorsForPage, 10);

        sinon.assert.calledWith(setDataForPageStuff.getCall(0), 'update-name', {
          firstName: account.claimant.forename,
          lastName: account.claimant.surname,
        });

        sinon.assert.calledWith(setDataForPageStuff.getCall(1), 'update-your-email-address', {
          emailAddress: account.claimant.email,
        });

        sinon.assert.calledWith(setDataForPageStuff.getCall(2), 'telephone-number-change', {
          homeNumber: account.claimant.homeNumber,
          mobileNumber: account.claimant.mobileNumber,
        });

        sinon.assert.calledWith(setDataForPageStuff.getCall(3), 'new-phone-number', {
          homeNumber: account.claimant.homeNumber,
        });

        sinon.assert.calledWith(setDataForPageStuff.getCall(4), 'new-mobile-number', {
          mobileNumber: account.claimant.mobileNumber,
        });

        sinon.assert.calledWith(setDataForPageStuff.getCall(5), '__hidden_address__', {
          addressDetails: account.claimant.address,
        });

        sinon.assert.calledWith(clearValidationErrorsForPage.getCall(0), 'update-name');
        sinon.assert.calledWith(clearValidationErrorsForPage.getCall(1),
          'update-your-email-address');
        sinon.assert.calledWith(clearValidationErrorsForPage.getCall(2),
          'telephone-number-change');
        sinon.assert.calledWith(clearValidationErrorsForPage.getCall(3), 'new-phone-number');
        sinon.assert.calledWith(clearValidationErrorsForPage.getCall(4), 'new-mobile-number');
        sinon.assert.calledWith(clearValidationErrorsForPage.getCall(5), 'new-postcode');
        sinon.assert.calledWith(clearValidationErrorsForPage.getCall(6), 'new-address-select');
        sinon.assert.calledWith(clearValidationErrorsForPage.getCall(7), 'enter-address');

        sandbox.restore();
      });
    });

  });
});
