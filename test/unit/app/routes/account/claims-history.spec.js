const rewire = require('rewire');
const chai = require('chai');
const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');

const page = rewire('../../../../../app/routes/account/claims-history');

const {
  assert,
  expect,
} = chai;
const sinon = require('sinon');
const { claimTypesFullName } = require('../../../../../app/config/claim-types');
chai.use(require('sinon-chai'));

const getSubmittedClaimsStub = sinon.stub();
page.__set__('submittedClaimsFetcher', { getSubmittedClaims: getSubmittedClaimsStub });

const responseDataEA = {
  status: 200,
  data: [
    {
      id: 28,
      createdDate: '2022-02-15T10:36:09.611',
      lastModifiedDate: '2022-02-15T10:36:09.611',
      claimStatus: 'AWAITING_AGENT_APPROVAL',
      nino: 'AA370773A',
      claimType: 'EQUIPMENT_OR_ADAPTATION',
    },
    {
      id: 29,
      createdDate: '2022-02-15T10:36:09.611',
      lastModifiedDate: '2022-02-15T10:36:09.611',
      claimStatus: 'AWAITING_AGENT_APPROVAL',
      nino: 'AA370773A',
      claimType: 'EQUIPMENT_OR_ADAPTATION',
    },
  ],
};

const responseDataSW = {
  status: 200,
  data: [
    {
      id: 27,
      createdDate: '2022-02-15T10:36:09.611',
      lastModifiedDate: '2022-02-15T10:36:09.611',
      claimStatus: 'AWAITING_COUNTER_SIGN',
      nino: 'AA370773A',
      claimType: 'SUPPORT_WORKER',
    },
    {
      id: 28,
      createdDate: '2022-02-15T10:36:09.611',
      lastModifiedDate: '2022-02-15T10:36:09.611',
      claimStatus: 'AWAITING_AGENT_APPROVAL',
      nino: 'AA370773A',
      claimType: 'SUPPORT_WORKER',
    },
    {
      id: 29,
      createdDate: '2022-02-15T10:36:09.611',
      lastModifiedDate: '2022-02-15T10:36:09.611',
      claimStatus: 'AWAITING_DRS_UPLOAD',
      nino: 'AA370773A',
      claimType: 'SUPPORT_WORKER',
    },
  ],
};

const responseDataTW = {
  status: 200,
  data: [
    {
      id: 26,
      createdDate: '2022-02-15T10:36:09.161',
      lastModifiedDate: '2022-02-15T10:36:09.161',
      claimStatus: 'AWAITING_COUNTER_SIGN',
      nino: 'AA370773A',
      claimType: 'TRAVEL_TO_WORK',
      workplaceContact: {
        employmentStatus: 'employed'
      },
    },
    {
      id: 27,
      createdDate: '2022-02-15T10:36:09.611',
      lastModifiedDate: '2022-02-15T10:36:09.611',
      claimStatus: 'COUNTER_SIGN_REJECTED',
      nino: 'AA370773A',
      claimType: 'TRAVEL_TO_WORK',
      workplaceContact: {
        employmentStatus: 'employed'
      },
    },
    {
      id: 28,
      createdDate: '2022-02-15T10:36:09.611',
      lastModifiedDate: '2022-02-15T10:36:09.611',
      claimStatus: 'AWAITING_AGENT_APPROVAL',
      nino: 'AA370773A',
      claimType: 'TRAVEL_TO_WORK',
      workplaceContact: {
        employmentStatus: 'employed'
      },
    },
    {
      id: 29,
      createdDate: '2022-02-15T10:36:09.611',
      lastModifiedDate: '2022-02-15T10:36:09.611',
      claimStatus: 'AWAITING_DRS_UPLOAD',
      nino: 'AA370773A',
      claimType: 'TRAVEL_TO_WORK',
      workplaceContact: {
        employmentStatus: 'employed'
      },
    },
    {
      id: 30,
      createdDate: '2022-02-15T10:36:09.611',
      lastModifiedDate: '2022-02-15T10:36:09.611',
      claimStatus: 'UPLOADED_TO_DOCUMENT_BATCH',
      nino: 'AA370773A',
      claimType: 'TRAVEL_TO_WORK',
      workplaceContact: {
        employmentStatus: 'employed'
      },
    },
    {
      id: 31,
      createdDate: '2022-02-15T10:36:09.611',
      lastModifiedDate: '2022-02-15T10:36:09.611',
      claimStatus: 'AWAITING_DRS_UPLOAD',
      nino: 'AA370773A',
      claimType: 'TRAVEL_TO_WORK',
      workplaceContact: {
        employmentStatus: 'selfEmployed'
      },
    },
  ],
};

describe('/claims-history', () => {
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

    it('GET EA - claims-history.njk', async () => {
      const router = page(app);
      const nextStub = sinon.stub();

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            account: {
              elements: [
                {
                  claimType: claimTypesFullName.EA,
                },
              ],
              sentForPayment: [
                {
                  sentForPaymentOn: '2022-02-14T19:52:44.694',
                  amountPaid: '£900',
                  claimType: claimTypesFullName.EA,
                },
              ],

            },
          };
        },
      };

      req.session.claimHistory = {
        awardType: claimTypesFullName.EA,
      };

      getSubmittedClaimsStub
            .resolves(Promise.resolve(responseDataEA.data));
      await router.claimsHistory(req, res, nextStub);

      assert.deepEqual(res.locals.sentForPayment, [
        {
          sentForPaymentOn: '2022-02-14T19:52:44.694',
          amountPaid: '£900',
          claimType: claimTypesFullName.EA,
        },
      ]);

      assert.deepEqual(res.locals.sentToWorkPlace, []);

      assert.deepEqual(res.locals.sentToDwp, [
        {
          id: 28,
          createdDate: '2022-02-15T10:36:09.611',
          lastModifiedDate: '2022-02-15T10:36:09.611',
          claimStatus: 'AWAITING_AGENT_APPROVAL',
          nino: 'AA370773A',
          claimType: 'EQUIPMENT_OR_ADAPTATION',
        },
        {
          id: 29,
          createdDate: '2022-02-15T10:36:09.611',
          lastModifiedDate: '2022-02-15T10:36:09.611',
          claimStatus: 'AWAITING_AGENT_APPROVAL',
          nino: 'AA370773A',
          claimType: 'EQUIPMENT_OR_ADAPTATION',
        }]);

      assert.equal(res.rendered.view, 'pages/account/claims-history.njk');
    });

    it('GET SW - claims-history.njk', async () => {
      const router = page(app);
      const nextStub = sinon.stub();

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            account: {
              elements: [
                {
                  claimType: claimTypesFullName.SW,
                },
              ],
              sentForPayment: [
                {
                  sentForPaymentOn: '2022-02-14T19:52:44.694',
                  amountPaid: '£900',
                  claimType: claimTypesFullName.SW,
                },
              ],
            },
          };
        },
      };

      req.session.claimHistory = {
        awardType: claimTypesFullName.SW,
      };

      getSubmittedClaimsStub
            .resolves(Promise.resolve(responseDataSW.data));
      await router.claimsHistory(req, res, nextStub);

      assert.deepEqual(res.locals.sentForPayment, [
        {
          sentForPaymentOn: '2022-02-14T19:52:44.694',
          amountPaid: '£900',
          claimType: claimTypesFullName.SW,
        },
      ]);

      assert.deepEqual(res.locals.sentToWorkPlace, [
        {
          id: 27,
          createdDate: '2022-02-15T10:36:09.611',
          lastModifiedDate: '2022-02-15T10:36:09.611',
          claimStatus: 'AWAITING_COUNTER_SIGN',
          nino: 'AA370773A',
          claimType: 'SUPPORT_WORKER',
        }]);

      assert.deepEqual(res.locals.confirmedClaims, [
        {
          id: 28,
          createdDate: '2022-02-15T10:36:09.611',
          lastModifiedDate: '2022-02-15T10:36:09.611',
          claimStatus: 'AWAITING_AGENT_APPROVAL',
          nino: 'AA370773A',
          claimType: 'SUPPORT_WORKER',
        },
        {
          id: 29,
          createdDate: '2022-02-15T10:36:09.611',
          lastModifiedDate: '2022-02-15T10:36:09.611',
          claimStatus: 'AWAITING_DRS_UPLOAD',
          nino: 'AA370773A',
          claimType: 'SUPPORT_WORKER',
        }]);

      assert.equal(res.rendered.view, 'pages/account/claims-history.njk');
    });

    it('GET TW - claims-history.njk', async () => {
      const router = page(app);
      const nextStub = sinon.stub();

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            account: {
              elements: [
                {
                  claimType: claimTypesFullName.TW,
                },
              ],
              sentForPayment: [
                {
                  sentForPaymentOn: '2022-02-14T19:52:44.694',
                  amountPaid: '£900',
                  claimType: claimTypesFullName.TW,
                },
              ],

            },
          };
        },
      };

      req.session.claimHistory = {
        awardType: claimTypesFullName.TW,
      };

      getSubmittedClaimsStub
            .resolves(Promise.resolve(responseDataTW.data));
      await router.claimsHistory(req, res, nextStub);

      assert.deepEqual(res.locals.sentToDwp, [
      {
        id: 31,
        createdDate: '2022-02-15T10:36:09.611',
        lastModifiedDate: '2022-02-15T10:36:09.611',
        claimStatus: 'AWAITING_DRS_UPLOAD',
        nino: 'AA370773A',
        claimType: 'TRAVEL_TO_WORK',
        workplaceContact: {
          employmentStatus: 'selfEmployed'
        }
      }]);

      assert.deepEqual(res.locals.sentForPayment, [
        {
          sentForPaymentOn: '2022-02-14T19:52:44.694',
          amountPaid: '£900',
          claimType: claimTypesFullName.TW,
        },
      ]);

      assert.deepEqual(res.locals.sentToWorkPlace, [
        {
          id: 26,
          createdDate: '2022-02-15T10:36:09.161',
          lastModifiedDate: '2022-02-15T10:36:09.161',
          claimStatus: 'AWAITING_COUNTER_SIGN',
          nino: 'AA370773A',
          claimType: 'TRAVEL_TO_WORK',
          workplaceContact: {
            employmentStatus: 'employed'
          },
        }]);

      assert.deepEqual(res.locals.confirmedClaims, [
        {
          id: 28,
          createdDate: '2022-02-15T10:36:09.611',
          lastModifiedDate: '2022-02-15T10:36:09.611',
          claimStatus: 'AWAITING_AGENT_APPROVAL',
          nino: 'AA370773A',
          claimType: 'TRAVEL_TO_WORK',
          workplaceContact: {
            employmentStatus: 'employed'
          },
        },
        {
          id: 29,
          createdDate: '2022-02-15T10:36:09.611',
          lastModifiedDate: '2022-02-15T10:36:09.611',
          claimStatus: 'AWAITING_DRS_UPLOAD',
          nino: 'AA370773A',
          claimType: 'TRAVEL_TO_WORK',
          workplaceContact: {
            employmentStatus: 'employed'
          },
        },
        {
          id: 30,
          createdDate: '2022-02-15T10:36:09.611',
          lastModifiedDate: '2022-02-15T10:36:09.611',
          claimStatus: 'UPLOADED_TO_DOCUMENT_BATCH',
          nino: 'AA370773A',
          claimType: 'TRAVEL_TO_WORK',
          workplaceContact: {
            employmentStatus: 'employed'
          },
        },
      ]);

      assert.deepEqual(res.locals.rejectedClaims, [
        {
          id: 27,
          createdDate: '2022-02-15T10:36:09.611',
          lastModifiedDate: '2022-02-15T10:36:09.611',
          claimStatus: 'COUNTER_SIGN_REJECTED',
          nino: 'AA370773A',
          claimType: 'TRAVEL_TO_WORK',
          workplaceContact: {
            employmentStatus: 'employed'
          },
        }]);

      assert.equal(res.rendered.view, 'pages/account/claims-history.njk');
    });

    it('UNEXPECTED RESPONSE 204 - claims-history.njk', async () => {
      const router = page(app);
      const nextStub = sinon.stub();

      const failedResponse = { 
        response: { status: 204 }
      };

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            account: {
              elements: [
                {
                  claimType: claimTypesFullName.EA,
                },
              ],
              sentForPayment: [],
            },
          };
        },
      };
      
      getSubmittedClaimsStub.resolves(Promise.reject(failedResponse));
      await router.claimsHistory(req, res, nextStub);

      expect(res.redirectedTo)
        .to
        .be
        .equal('/claim/problem-with-service');
    });

    it('FAILED RESPONSE 404 - claims-history.njk', async () => {
      const router = page(app);
      const nextStub = sinon.stub();

      const failedResponse = {
        status: 404,
        data: []
      };

      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            account: {
              elements: [
                {
                  claimType: claimTypesFullName.EA,
                },
              ],
              sentForPayment: [],
            },
          };
        },
      };

      getSubmittedClaimsStub
      .resolves(Promise.resolve(failedResponse.data));

      await router.claimsHistory(req, res, nextStub);

      assert.deepEqual(res.locals.sentForPayment, []);
      assert.deepEqual(res.locals.sentToWorkPlace, []);
      assert.deepEqual(res.locals.confirmedClaims, []);

      assert.equal(res.rendered.view, 'pages/account/claims-history.njk');
    });
  });
});
