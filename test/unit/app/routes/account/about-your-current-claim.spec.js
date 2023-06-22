const rewire = require('rewire');
const chai = require('chai');
const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');

const page = rewire('../../../../../app/routes/account/about-your-current-claim');

const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
const { claimTypesFullName } = require('../../../../../app/config/claim-types');
chai.use(require('sinon-chai'));

const axiosStub = sinon.stub();
page.__set__('axios', axiosStub);

const responseDataSW = {
  status: 200,
  data: {
    id: 7,
    createdDate: '2022-03-04T11:23:42.816',
    lastModifiedDate: '2022-03-04T11:23:42.816',
    claimStatus: 'AWAITING_COUNTER_SIGN',
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

describe('/about-your-current-claim', () => {
  const req = new Request();
  const res = new Response(req);

  it('should be a function', () => {
    assert.typeOf(page, 'function');
  });

  describe('when called', () => {
    const endSessionStub = sinon.stub();
    endSessionStub.resolves(Promise.resolve());

    const app = {
      endSession: endSessionStub,
      router: {
        get: sinon.stub(),
        post: sinon.stub(),
      },
    };

    it('GET SW with declaration - about-your-current-claim.njk', async () => {
      const router = page(app);
      const nextStub = sinon.stub();

      req.session = {
        claimHistory: {
          awardType: claimTypesFullName.SW,
        },
      };

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            account: {
              nino: 'AA370773A',
            },
          };
        },
      };
      axiosStub.resolves(Promise.resolve(responseDataSW));
      await router.aboutYourCurrentClaim(req, res, nextStub);

      assert.equal(res.statusCode, 200);

      assert.equal(res.locals.claimData, responseDataSW.data);

      assert.equal(res.rendered.view, 'pages/account/about-your-current-claim.njk');
    });

    it('UNEXPECTED RESPONSE 204 - claims-history.njk', async () => {
      const router = page(app);
      const nextStub = sinon.stub();

      const failedResponse = {
        status: 204,
      };

      axiosStub.resolves(Promise.resolve(failedResponse));

      try {
        await router.aboutYourCurrentClaim(req, res, nextStub);
        assert.fail('Oh no the exception not thrown');
      } catch (e) {
        expect(e.message)
          .to
          .be
          .equal('Oh no the exception not thrown');
      }
    });

    it('UNEXPECTED RESPONSE 404 - about-your-current-claim.njk', async () => {
      const router = page(app);
      const nextStub = sinon.stub();
      const redirectStub = sinon.stub();

      res.redirect = redirectStub;
      const failedResponse = {
        status: 404,
      };

      axiosStub.resolves(Promise.resolve(failedResponse));

      await router.aboutYourCurrentClaim(req, res, nextStub);

      expect(redirectStub)
        .to
        .be
        .calledOnceWithExactly('/claim/problem-with-service');
    });
  });
});
