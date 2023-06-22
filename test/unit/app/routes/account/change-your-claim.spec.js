const rewire = require('rewire');
const chai = require('chai');
const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const { mountURL } = require('../../../../../app/config/config-mapping');

const page = rewire('../../../../../app/routes/account/change-your-claim');

const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
const { claimTypesFullName } = require('../../../../../app/config/claim-types');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
chai.use(require('sinon-chai'));

const axiosStub = sinon.stub();
page.__set__('axios', axiosStub);

const responseData = {
  status: 200,
  data: {
    id: 7,
    createdDate: '2022-03-04T11:23:42.816',
    lastModifiedDate: '2022-03-04T11:23:42.816',
    claimStatus: 'COUNTER_SIGN_REJECTED',
    nino: 'AA370773A',
    claimType: 'SUPPORT_WORKER',
    cost: 2000.0,
    payee: {
      details: {
        fullName: 'INeed Paying',
        emailAddress: 'payment@now.com',
      },
      address: {
        address1: 'THE COTTAGE',
        address2: 'ST. MARYS ISLAND',
        address3: 'WHITLEY BAY',
        address4: null,
        postcode: 'NE26 4RS',
      },
      bankDetails: {
        accountHolderName: 'Ineed Paying',
        sortCode: '000004',
        accountNumber: '12345677',
        rollNumber: null,
      },
    },
    declarationVersion: 2.1,
    journeyContext: {},
    workplaceContact: {
      emailAddress: 'count@signer.com',
      fullName: 'Count Signer',
      reason: 'Bad claim',
    },
    claim: {
      0: {
        monthYear: {
          mm: '04',
          yyyy: '2020',
        },
        claim: [
          {
            dayOfSupport: '1',
            hoursOfSupport: '2',
            nameOfSupport: 'person 1',
          },
          {
            dayOfSupport: '2',
            hoursOfSupport: '3',
            nameOfSupport: 'Person 2',
          },
        ],
      },
      1: {
        monthYear: {
          mm: '05',
          yyyy: '2020',
        },
        claim: [
          {
            dayOfSupport: '12',
            hoursOfSupport: '12',
            nameOfSupport: null,
          },
          {
            dayOfSupport: '14',
            hoursOfSupport: '12',
            nameOfSupport: 'Person 4',
          },
        ],
      },
    },
    evidence: [
      {
        fileId: '09672038-7155-4cb9-8b2e-56eda1fd6b53/7e67a9c5-f7c7-4565-a2ab-6c36530e0710',
        fileName: '6b99f480c27e246fa5dd0453cd4fba29.pdf',
      },
      {
        fileId: 'b9c2ea02-f424-4cd3-bdc1-0ab1c26706fe/cfda6946-7bb5-4886-8b27-beaccbd8e834',
        fileName: 'Technical Architect.docx',
      },
    ],
  },
};
describe('/change-your-claim', () => {

  describe('GET /change-your-claim', () => {
    const req = new Request();
    const res = new Response(req);

    it('should be a function', () => {
      assert.typeOf(page, 'function');
    });

    describe('GET when called', () => {
      const endSessionStub = sinon.stub();
      endSessionStub.resolves(Promise.resolve());
      const app = {
        endSession: endSessionStub,
        router: {
          get: sinon.stub(),
          post: sinon.stub(),
        },
      };

      it('GET SW reject claim - change-your-claim.njk', async () => {
        const router = page(app);
        const nextStub = sinon.stub();
        const sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').callsFake();

        req.session = {
          claimHistory: {
            awardType: claimTypesFullName.SW,
          },
          save: sinon.stub()
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };
        req.query = {
          id: 7,
        };

        req.casa.journeyContext = {
          setDataForPage: sinon.stub(),
          getDataForPage: () => {
            return {
              account: {
                nino: 'AA370773A',
              },
            };
          },
        };
        axiosStub.resolves(Promise.resolve(responseData));
        await router.changeYourClaimGet(req, res, nextStub);

        assert.equal(res.statusCode, 200);

        assert.equal(res.locals.claimReferenceNumber, 'SW00000007');
        assert.equal(res.locals.typeOfClaimString, 'change-your-claim:sw');
        assert.equal(res.locals.changesYouNeedToMake, responseData.data.workplaceContact.reason);
        assert.equal(res.locals.dateOfClaim, responseData.data.createdDate);

        assert.equal(res.rendered.view, 'pages/account/change-your-claim.njk');
        sandbox.restore();
      });

      it('GET TW reject claim - change-your-claim.njk', async () => {
        const router = page(app);
        const nextStub = sinon.stub();
        const sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').callsFake();

        req.session = {
          claimHistory: {
            awardType: claimTypesFullName.TW,
          },
          save: sinon.stub()
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };
        req.query = {
          id: 7,
        };

        req.casa.journeyContext = {
          setDataForPage: sinon.stub(),
          getDataForPage: () => {
            return {
              account: {
                nino: 'AA370773A',
              },
            };
          },
        };
        axiosStub.resolves(Promise.resolve(responseData));
        await router.changeYourClaimGet(req, res, nextStub);

        assert.equal(res.statusCode, 200);

        assert.equal(res.locals.claimReferenceNumber, 'TW00000007');
        assert.equal(res.locals.typeOfClaimString, 'change-your-claim:tw');
        assert.equal(res.locals.changesYouNeedToMake, responseData.data.workplaceContact.reason);
        assert.equal(res.locals.dateOfClaim, responseData.data.createdDate);

        assert.equal(res.rendered.view, 'pages/account/change-your-claim.njk');
        sandbox.restore();
      });

      it('Error for invalid claimType', async () => {
        const router = page(app);

        req.session = {
          claimHistory: {
            awardType: 'TI',
          },
          save: sinon.stub()
            .callsFake((cb) => {
              if (cb) {
                cb();
              }
            }),
        };
        req.query = {
          id: 7,
        };

        req.casa.journeyContext = {
          setDataForPage: sinon.stub(),
          getDataForPage: () => {
            return {
              account: {
                nino: 'AA370773A',
              },
            };
          },
        };
        axiosStub.resolves(Promise.resolve(responseData));

        await router.changeYourClaimGet(req, res);

        expect(res.redirectedTo)
          .to
          .be
          .equal(`/claim/problem-with-service`);

      });

      it('UNEXPECTED RESPONSE 204 - claims-history.njk', async () => {
        const router = page(app);

        const failedResponse = {
          status: 204,
        };

        axiosStub.resolves(Promise.resolve(failedResponse));

        try {
          await router.changeYourClaimGet(req, res);
          assert.fail('Oh no the exception not thrown');
        } catch (e) {
          expect(e.message)
            .to
            .be
            .equal('Oh no the exception not thrown');
        }
      });

      it('UNEXPECTED RESPONSE 404 - change-your-claim.njk', async () => {
        const router = page(app);
        const redirectStub = sinon.stub();

        res.redirect = redirectStub;
        const failedResponse = {
          status: 404,
        };

        axiosStub.resolves(Promise.resolve(failedResponse));

        await router.changeYourClaimGet(req, res);

        expect(redirectStub)
          .to
          .be
          .calledOnceWithExactly('/claim/problem-with-service');
      });
    });
  });
  describe('POST /change-your-claim', async () => {
    const req = new Request();
    const res = new Response(req);

    const endSessionStub = sinon.stub();
    endSessionStub.resolves(Promise.resolve());
    const app = {
      endSession: endSessionStub,
      router: {
        get: sinon.stub(),
        post: sinon.stub(),
      },
    };

    it(claimTypesFullName.TW, async () => {

      const router = page(app);

      req.session = {
        claimHistory: {
          awardType: claimTypesFullName.TW,
        },
        save: sinon.stub()
          .callsFake((cb) => {
            if (cb) {
              cb();
            }
          }),
      };

      req.casa.journeyContext = {
        setDataForPage: sinon.stub(),
        getDataForPage: () => {
          return {
            id: 7,
            journeyContext: {
              data: {},
              validation: {},
              nav: {},
              identity: { id: 'default' },
            },
          };
        },
      };
      await router.changeYourClaimPost(req, res);

      expect(res.redirectedTo)
        .to
        .be
        .equal(`/claim/travel-to-work/check-your-answers`);

    });

    it(claimTypesFullName.SW, async () => {

      const router = page(app);

      req.session = {
        claimHistory: {
          awardType: claimTypesFullName.SW,
        },
        save: sinon.stub()
          .callsFake((cb) => {
            if (cb) {
              cb();
            }
          }),
      };

      req.casa.journeyContext = {
        setDataForPage: sinon.stub(),
        getDataForPage: () => {
          return {
            id: 7,
            journeyContext: {
              data: {},
              validation: {},
              nav: {},
              identity: { id: 'default' },
            },
          };
        },
      };
      await router.changeYourClaimPost(req, res);

      expect(res.redirectedTo)
        .to
        .be
        .equal(`/claim/support-worker/check-your-answers`);

    });

    it('IW) (invalid', async () => {

      const router = page(app);

      req.session = {
        claimHistory: {
          awardType: 'IW',
        },
        save: sinon.stub()
          .callsFake((cb) => {
            if (cb) {
              cb();
            }
          }),
      };

      req.casa.journeyContext = {
        setDataForPage: sinon.stub(),
        getDataForPage: () => {
          return {
            id: 7,
            journeyContext: {
              data: {},
              validation: {},
              nav: {},
              identity: { id: 'default' },
            },
          };
        },
      };
      await router.changeYourClaimPost(req, res);

      expect(res.redirectedTo)
        .to
        .be
        .equal(`${mountURL}problem-with-service`);

    });
  });
});


