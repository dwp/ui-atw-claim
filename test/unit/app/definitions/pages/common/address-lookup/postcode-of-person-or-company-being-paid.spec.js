const rewire = require('rewire');
const page = rewire(
  '../../../../../../../app/definitions/pages/common/address-lookup/enter-postcode');
const chai = require('chai');
const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const Request = require('../../../../../../helpers/fakeRequest');
const Response = require('../../../../../../helpers/fakeResponse');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

const axiosStub = sinon.stub();
page.__set__('axios', axiosStub);

const dataResponse = {
  status: 200,
  data: {
    'data': [
      {
        'key': 'GBR-47079655',
        'uprn': '47079655',
        'org': [],
        'subBuilding': null,
        'poBoxNumber': null,
        'buildingName': 'THE COTTAGE',
        'buildingNumber': null,
        'street': [
          'ST. MARYS ISLAND',
        ],
        'locality': [],
        'postTown': 'WHITLEY BAY',
        'postcode': 'NE26 4RS',
        'countryCode': 'GBR',
        'singleLine': 'THE COTTAGE, ST. MARYS ISLAND, WHITLEY BAY, NE26 4RS',
        'alternateSingleLine': 'THE COTTAGE, ST MARYS ISLAND, ST MARYS ISLAND ACCESS ROAD, WHITLEY BAY, NE26 4RS',
        'lines': [
          'THE COTTAGE',
          'ST. MARYS ISLAND',
          'WHITLEY BAY',
          'NE26 4RS',
        ],
        'homeNationCode': 'ENG',
        'localAuthority': 'NORTH TYNESIDE',
        'addressType': {
          'osLevel1Class': 'R',
          'osLevel2Class': 'D',
          'osLevel3Class': '2',
          'osLevel4Class': '',
          'osLevel1Description': 'RESIDENTIAL',
          'osLevel2Description': 'DWELLING',
          'osLevel3Description': 'DETACHED',
          'osLevel4Description': '',
        },
        'metaData': {
          'source': 'ORDNANCE_SURVEY',
        },
        'coordinates': {
          'latitude': '55.0717902',
          'longitude': '-1.4498227',
          'xCoordinate': '435231.00',
          'yCoordinate': '575396.00',
        },
      },
    ],
  },
};
const dataResponseNoAddress = {
  status: 200,
  data: { 'data': [] },
};

describe('definitions/pages/common/payee-details/postcode-of-person-or-company-being-paid', () => {
  it('should page a function', () => {
    assert.typeOf(page, 'function');
  });
  describe('when exported function is invoked', () => {
    beforeEach(() => {
      this.result = page(
        'pages/common/payee-details/postcode-of-person-or-company-being-paid.njk',
        require(
          '../../../../../../../app/definitions/field-validators/common/payee-details/postcode-of-person-or-company-being-paid'),
        'person-company-being-paid-postcode',
        'person-company-being-paid-address',
        'enter-person-company-being-paid-address',
        true,
      );
      axiosStub.reset();
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
          assert.equal(this.result.view,
            'pages/common/payee-details/postcode-of-person-or-company-being-paid.njk');
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

      describe('`preredirect` key', () => {
        it('should be defined', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('preredirect');
        });

        it('should be inEditMode preredirect', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('preredirect');

          const sandbox = sinon.createSandbox();
          sandbox.stub(JourneyContext, 'putContext')
            .callsFake();

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
            },
          };

          req.inEditMode = true;

          req.editOriginUrl = 'test-origin';

          const redirectStub = sinon.stub();

          res.redirect = redirectStub;

          this.result.hooks.preredirect(req, res, nextStub);

          sinon.assert.notCalled(nextStub);

          expect(redirectStub)
            .to
            .be
            .calledOnceWithExactly(
              'person-company-being-paid-address?edit=&editorigin=test-origin');

          sinon.assert.calledTwice(setDataForPageStub);
          sinon.assert.calledWith(setDataForPageStub.firstCall,
            'person-company-being-paid-address', undefined);
          sinon.assert.calledWith(setDataForPageStub.secondCall,
            'enter-person-company-being-paid-address', undefined);

          sandbox.restore();
        });

        it('should not be inEditMode preredirect', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('preredirect');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
            },
          };

          req.inEditMode = false;

          req.editOriginUrl = 'test-origin';

          const redirectStub = sinon.stub();

          res.redirect = redirectStub;

          this.result.hooks.preredirect(req, res, nextStub);

          sinon.assert.notCalled(setDataForPageStub);
          sinon.assert.notCalled(redirectStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
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

        it('should be inEditMode prerender', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('preredirect');
          const sandbox = sinon.createSandbox();
          sandbox.stub(JourneyContext, 'putContext')
            .callsFake();
          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: (pageName) => {
                if (pageName === '__hidden_address__') {
                  return {
                    addressDetails: {
                      postcode: 'NE26 4RS',
                    },
                  };
                } else if (pageName === 'person-company-being-paid-details') {
                  return {
                    fullName: 'Joe Blogs',
                  };
                }
              },
            },
          };

          req.inEditMode = true;

          this.result.hooks.prerender(req, res, nextStub);

          assert.equal(res.locals.payeeName, 'Joe Blogs');

          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('person-company-being-paid-postcode',
              { postcode: 'NE26 4RS' });

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          sandbox.restore();

        });

        it('should not be inEditMode prerender', () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('prerender');

          const sandbox = sinon.createSandbox();
          sandbox.stub(JourneyContext, 'putContext').callsFake();

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: (pageName) => {
                if (pageName === 'person-company-being-paid-details') {
                  return {
                    fullName: 'Joe Blogs',
                  };
                }
              },
            },
          };

          req.inEditMode = false;

          this.result.hooks.prerender(req, res, nextStub);

          assert.equal(res.locals.payeeName, 'Joe Blogs');

          sinon.assert.notCalled(setDataForPageStub);

          expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

          sandbox.restore();
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

        it('should retrieve a list of addresses', async () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('postvalidate');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyWaypointId: 'person-company-being-paid-postcode',
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: () => {
                return {
                  postcode: 'NE26 4RS',
                };
              },
            },
          };

          axiosStub.resolves(Promise.resolve(dataResponse));

          await this.result.hooks.postvalidate(req, res, nextStub);

          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('person-company-being-paid-postcode', {
              postcode: 'NE26 4RS',
              lookup_attempted: true,
              addresses: [
                {
                  uprn: '47079655',
                  postcode: 'NE26 4RS',
                  singleLine: 'THE COTTAGE, ST. MARYS ISLAND, WHITLEY BAY, NE26 4RS',
                }],
            });
          sinon.assert.calledOnce(nextStub);
        });

        it('should retrieve a 0 addresses', async () => {
          expect(Object.keys(this.result))
            .to
            .includes('hooks');
          expect(Object.keys(this.result.hooks))
            .to
            .includes('postvalidate');

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyWaypointId: 'person-company-being-paid-postcode',
            journeyContext: {
              setDataForPage: setDataForPageStub,
              getDataForPage: () => {
                return {
                  postcode: 'NE26 4RS',
                };
              },
            },
          };

          axiosStub.resolves(Promise.resolve(dataResponseNoAddress));

          await this.result.hooks.postvalidate(req, res, nextStub);

          expect(setDataForPageStub)
            .to
            .be
            .calledOnceWithExactly('person-company-being-paid-postcode', {
              postcode: 'NE26 4RS',
              lookup_attempted: true,
              addresses: [],
            });
          sinon.assert.calledOnce(nextStub);
        });
      });
    });
  });
});
