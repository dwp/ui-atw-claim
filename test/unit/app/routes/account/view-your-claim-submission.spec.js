const rewire = require('rewire');
const chai = require('chai');
const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');

const page = rewire('../../../../../app/routes/account/view-your-claim-submission');

const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
const { claimTypesFullName } = require('../../../../../app/config/claim-types');
chai.use(require('sinon-chai'));

const axiosStub = sinon.stub();
page.__set__('axios', axiosStub);

const responseDataEA = {
  status: 200,
  data:
    {
      id: 28,
      createdDate: '2022-02-15T10:36:14.771',
      lastModifiedDate: '2022-02-15T10:36:14.771',
      claimStatus: 'AWAITING_AGENT_APPROVAL',
      nino: 'AA370773A',
      claimType: 'EQUIPMENT_OR_ADAPTATION',
      cost: 2211.0,
      payee: {
        details: {
          fullName: 'George Herbert',
          emailAddress: 'name@name.com',
        },
      },
      declarationVersion: 2.1,
      evidence: [
        {
          fileId: '633ce73b-1414-433e-8a08-72449a0244fc/144b2aca-996d-4c27-bdf2-1e9b418874d3',
          fileName: '6b99f480c27e246fa5dd0453cd4fba29.pdf',
        },
      ],
      claim: [
        {
          description: 'Item 1',
          dateOfPurchase: {
            dd: '22',
            mm: '11',
            yyyy: '2020',
          },
        },
      ],
    },
};

const responseDataEANoDeclaration = {
  status: 200,
  data:
    {
      id: 28,
      createdDate: '2022-02-15T10:36:14.771',
      lastModifiedDate: '2022-02-15T10:36:14.771',
      claimStatus: 'AWAITING_AGENT_APPROVAL',
      nino: 'AA370773A',
      claimType: 'EQUIPMENT_OR_ADAPTATION',
      cost: 2211.0,
      payee: {
        details: {
          fullName: 'George Herbert',
          emailAddress: 'name@name.com',
        },
      },
      evidence: [
        {
          fileId: '633ce73b-1414-433e-8a08-72449a0244fc/144b2aca-996d-4c27-bdf2-1e9b418874d3',
          fileName: '6b99f480c27e246fa5dd0453cd4fba29.pdf',
        },
      ],
      claim: [
        {
          description: 'Item 1',
          dateOfPurchase: {
            dd: '22',
            mm: '11',
            yyyy: '2020',
          },
        },
      ],
    },
};

const responseDataSW = {
  status: 200,
  data: {
    id: 30,
    createdDate: '2022-02-15T10:36:19.689',
    lastModifiedDate: '2022-02-15T16:28:30.597',
    claimStatus: 'UPLOADED_TO_DOCUMENT_BATCH',
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
    workplaceContact: {
      emailAddress: 'count@signer.com',
      fullName: 'Count Signer',
      organisation: 'company2',
      jobTitle: 'boss2',
      address: {
        address1: 'THE COTTAGE',
        address2: 'ST. MARYS ISLAND',
        address3: 'WHITLEY BAY',
        address4: 'WHITLEY BAY',
        postcode: 'NE26 4RS',
      },
      updatedOn: '2022-02-15T16:28:30.583',
      declarationVersion: 2.1,
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
            timeOfSupport: {
              hoursOfSupport: '2',
              minutesofSupport: '15',
            },  
            nameOfSupport: 'person 1',
          },
          {
            dayOfSupport: '2',
            timeOfSupport: {
              hoursOfSupport: '3',
              minutesofSupport: '15',
            },             
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
            timeOfSupport: {
              hoursOfSupport: '12',
              minutesofSupport: '15',
            },             
            nameOfSupport: null,
          },
          {
            dayOfSupport: '14',
            timeOfSupport: {
              hoursOfSupport: '12',
              minutesofSupport: '30',
            },             
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

const responseDataSWNoDeclaration = {
  status: 200,
  data: {
    id: 30,
    createdDate: '2022-02-15T10:36:19.689',
    lastModifiedDate: '2022-02-15T16:28:30.597',
    claimStatus: 'AWAITING_DRS_UPLOAD',
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
    workplaceContact: {
      emailAddress: 'count@signer.com',
      fullName: 'Count Signer',
      organisation: 'company2',
      jobTitle: 'boss2',
      address: {
        address1: 'THE COTTAGE',
        address2: 'ST. MARYS ISLAND',
        address3: 'WHITLEY BAY',
        address4: 'WHITLEY BAY',
        postcode: 'NE26 4RS',
      },
      updatedOn: '2022-02-15T16:28:30.583',
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
            timeOfSupport: {
              hoursOfSupport: '2',
              minutesofSupport: '45',
            },             
            nameOfSupport: 'person 1',
          },
          {
            dayOfSupport: '2',
            timeOfSupport: {
              hoursOfSupport: '3',
              minutesofSupport: '0',
            },             
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
            timeOfSupport: {
              hoursOfSupport: '12',
              minutesofSupport: '15',
            },             
            nameOfSupport: null,
          },
          {
            dayOfSupport: '14',
            timeOfSupport: {
              hoursOfSupport: '12',
              minutesofSupport: '30',
            },             
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
const responseWrongStatus = {
  status: 200,
  data: {
    id: 30,
    claimStatus: 'COUNTER_SIGN_REJECTED',
    nino: 'AA370773A',
  },
};

describe('/view-your-claim-submission', () => {
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

    it('GET EA with declaration - view-your-claim-submission.njk', async () => {
      const router = page(app);
      const nextStub = sinon.stub();

      req.session = {
        claimHistory: {
          awardType: claimTypesFullName.EA,
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

      axiosStub.resolves(Promise.resolve(responseDataEA));
      await router.viewClaimSubmission(req, res, nextStub);

      assert.equal(res.statusCode, 200);

      assert.equal(res.locals.claimData, responseDataEA.data);

      assert.equal(res.rendered.view, 'pages/account/view-your-claim-submission.njk');
    });

    it('GET EA without declaration - view-your-claim-submission.njk', async () => {
      const router = page(app);
      const nextStub = sinon.stub();

      req.session = {
        claimHistory: {
          awardType: claimTypesFullName.EA,
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

      axiosStub.resolves(Promise.resolve(responseDataEANoDeclaration));
      await router.viewClaimSubmission(req, res, nextStub);

      assert.equal(res.statusCode, 200);
      assert.equal(res.locals.claimData, responseDataEANoDeclaration.data);

      assert.equal(res.rendered.view, 'pages/account/view-your-claim-submission.njk');
    });

    it('GET SW with declarations - view-your-claim-submission.njk', async () => {
      const router = page(app);
      const nextStub = sinon.stub();

      req.session = {
        claimHistory: {
          awardType: claimTypesFullName.EA,
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
      await router.viewClaimSubmission(req, res, nextStub);

      assert.equal(res.statusCode, 200);

      assert.equal(res.locals.claimData, responseDataSW.data);

      assert.equal(res.rendered.view, 'pages/account/view-your-claim-submission.njk');
    });

    it('GET SW without declarations - view-your-claim-submission.njk', async () => {
      const router = page(app);
      const nextStub = sinon.stub();

      req.session = {
        claimHistory: {
          awardType: claimTypesFullName.EA,
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

      axiosStub.resolves(Promise.resolve(responseDataSWNoDeclaration));
      await router.viewClaimSubmission(req, res, nextStub);

      assert.equal(res.statusCode, 200);
      assert.equal(res.locals.claimData, responseDataSWNoDeclaration.data);
  
      assert.equal(res.rendered.view, 'pages/account/view-your-claim-submission.njk');
    });

    it('GET SW invalid claimStatus', async () => {
      const req = new Request();
      const res = new Response(req);

      const router = page(app);
      const nextStub = sinon.stub();
      const redirectStub = sinon.stub();

      res.redirect = redirectStub;

      req.session = {
        claimHistory: {
          awardType: claimTypesFullName.EA,
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

      axiosStub.resolves(Promise.resolve(responseWrongStatus));
      await router.viewClaimSubmission(req, res, nextStub);

      assert.equal(res.statusCode, 200);

      assert.equal(res.locals.claimData, undefined);

      expect(redirectStub)
        .to
        .be
        .calledOnceWithExactly('/claim/problem-with-service');
    });

    it('UNEXPECTED RESPONSE 404 - view-your-claim-submission.njk', async () => {
      const router = page(app);
      const nextStub = sinon.stub();
      const redirectStub = sinon.stub();

      res.redirect = redirectStub;
      const failedResponse = {
        status: 404,
      };

      axiosStub.resolves(Promise.resolve(failedResponse));

      await router.viewClaimSubmission(req, res, nextStub);

      expect(redirectStub)
        .to
        .be
        .calledOnceWithExactly('/claim/problem-with-service');
    });
  });
});
