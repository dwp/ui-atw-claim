const page = require('../../../../../../app/definitions/pages/common/address-lookup/manual-address-entry');
const sinon = require('sinon');
const Request = require('../../../../../helpers/fakeRequest');
const Response = require('../../../../../helpers/fakeResponse');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const { trimPostalAddressObject } = require('@dwp/govuk-casa').gatherModifiers;

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('definitions/pages/equipment-or-adaptation/enter-address-of-person-or-company-being-paid', () => {
  it('should page a function', () => {
    assert.typeOf(page, 'function');
  });
  describe('when exported function is invoked', () => {
    beforeEach(() => {
      this.result = page(
        'pages/common/payee-details/enter-address-of-person-or-company-being-paid.njk',
        require('../../../../../../app/definitions/field-validators/common/payee-details/enter-address-of-person-or-company-being-paid'),
        'enter-person-company-being-paid-address',
        '__hidden_address__',
        true,
      );
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
          assert.equal(this.result.view, 'pages/common/payee-details/enter-address-of-person-or-company-being-paid.njk');
        });
      });
      describe('`fieldValidators` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('fieldValidators');
        });

        it('value should return an object', () => {
          assert.typeOf(this.result.fieldValidators, 'object');
        });
      });
    });

    describe('Utils: trimPostalAddressObject', () => {
      it('should check fieldGatherModifier is there', () => {
        expect(Object.keys(this.result))
            .to
            .includes('fieldGatherModifiers');
      });

      it('should trim spaces from the address values', async () => {
        expect(Object.keys(this.result))
            .to
            .includes('fieldGatherModifiers');

        const req = new Request();

        req.body.address = {
          fieldValue: {
            address1: '    1 Test Road    ',
            address2: '    L o n d o n ',
            address3: ' England   ',
            address4: ' UK ',
            postcode: '    N   E 26   4 RS   ',
          }
        };

        const expectedAddress = {
          address1: '1 Test Road',
          address2: 'L o n d o n',
          address3: 'England',
          address4: 'UK',
          postcode: 'NE26 4RS',
        };

        expect(trimPostalAddressObject(req.body.address))
            .to
            .include
            .deep
            .equals(expectedAddress);
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
      it('should populate local with payeeName', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('prerender');

        const req = new Request();
        const res = new Response(req);

        const getDataForPageStub = sinon.stub()
          .returns({
            fullName: 'George',
            journeyType: 'TRAVEL_IN_WORK',
          });
        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();
        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
            setDataForPage: setDataForPageStub
          }
        };

        this.result.hooks.prerender(req, res, nextStub);

        assert.equal(res.locals.payeeName, 'George');
        assert.equal(res.locals.awardType, 'TIW');

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();

        sinon.assert.calledWithExactly(getDataForPageStub, '__journey_type__');
        sinon.assert.calledWithExactly(getDataForPageStub, 'person-company-being-paid-details')

        sinon.assert.notCalled(setDataForPageStub);
      });
    });
    describe('`postvalidate` key', () => {
      it('should be defined', () => {
        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('postvalidate');
      });

      it('should setPage on hidden Address Waypoint', () => {
        const sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').callsFake();

        const addressObj = {
          address1: 'Road',
          address2: 'Road2',
          postCode: 'Post Code',
        };

        expect(Object.keys(this.result))
          .to
          .includes('hooks');
        expect(Object.keys(this.result.hooks))
          .to
          .includes('postvalidate');

        const req = new Request();
        const res = new Response(req);

        const getDataForPageStub = sinon.stub()
          .returns({ 'address': addressObj });
        const setDataForPageStub = sinon.stub();
        const nextStub = sinon.stub();

        req.session = {
          save: sinon.stub()
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };

        req.casa = {
          journeyContext: {
            getDataForPage: getDataForPageStub,
            setDataForPage: setDataForPageStub
          }
        };

        this.result.hooks.postvalidate(req, res, nextStub);

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();

        expect(getDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('enter-person-company-being-paid-address');

        expect(setDataForPageStub)
          .to
          .be
          .calledOnceWithExactly('__hidden_address__', {
            addressDetails: addressObj,
            addressFrom: 'manual'
          });

        sandbox.restore();
      });
    });
  });
});
