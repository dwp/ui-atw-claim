const Request = require('../../../../helpers/fakeRequest');
const Response = require('../../../../helpers/fakeResponse');
const page = require('../../../../../app/routes/account/multiple-job-select');

const sinon = require('sinon');
const {
  claimTypesFullName
} = require('../../../../../app/config/claim-types');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

let assert;
(async() => {
  assert = (await import ('chai')).assert;
  chai = await import ('chai');
  chai.use(require('sinon-chai'));
})();

const mockData = {
  getDataForPage: () => {
    return {
      'account': {
        elements: [
          {
            id: 86709321,
            claimType: 'ADAPTATION_TO_VEHICLE',
            spendToDate: 0,
            totalCost: 1943.97,
            nonAtwCost: 0,
            atwCost: 1943.97,
            startDate: '2022-02-21',
            endDate: '2029-02-21',
            company: 'British Rubbish Ltd',
            adaptionToVehicleElementItems: [ [Object], [Object], [Object], [Object] ]
          },
          {
            id: 86710207,
            claimType: 'TRAVEL_TO_WORK',
            spendToDate: 40,
            totalCost: 31285.7143,
            nonAtwCost: 0,
            atwCost: 31285.7143,
            startDate: '2022-02-21',
            endDate: '2025-02-19',
            company: 'Singer Music',
            travelToWorkDetails: {
              numberOfJourneysPerPeriod: 10,
              contributionsPerJourney: 0,
              costPerJourney: 20,
              perPeriodFrequency: 'WEEK'
            }
          },
          {
            id: 86710300,
            claimType: 'EQUIPMENT_OR_ADAPTATION',
            spendToDate: 0,
            totalCost: 3000,
            nonAtwCost: 0,
            atwCost: 3000,
            startDate: '2022-02-21',
            endDate: '2029-02-21',
            company: 'Stones R Us',
            saeElementItems: [ [Object] ]
          },
          {
            id: 86709191,
            claimType: 'SUPPORT_WORKER',
            spendToDate: 0,
            totalCost: 28157.1429,
            nonAtwCost: 0,
            atwCost: 28157.1429,
            startDate: '2021-12-12',
            endDate: '2024-12-10',
            company: 'British Rubbish Ltd',
            supportWorkerDetails: {
              supportType: 'Other',
              numberOfEvents: 10,
              totalContributions: 0,
              supportCost: 18,
              eventFrequency: 'HOUR',
              perPeriodFrequency: 'WEEK',
              costPerPeriod: true
            }
          },
          {
            id: 86710208,
            claimType: 'TRAVEL_IN_WORK',
            spendToDate: 40,
            totalCost: 31285.7143,
            nonAtwCost: 0,
            atwCost: 31285.7143,
            startDate: '2022-02-21',
            endDate: '2025-02-19',
            company: 'Travel in Work Music'
          },
          {
            id: 86710209,
            claimType: 'TRAVEL_IN_WORK',
            spendToDate: 100,
            totalCost: 2500,
            nonAtwCost: 0,
            atwCost: 1000.5,
            startDate: '2024-03-27',
            endDate: '2027-03-26',
            company: 'Travel in Work Sports'
          }
        ],
      },
    };
  },
};

describe('/multiple-job-select', () => {

  let req, res, nextStub, app, sandbox;

  beforeEach(() => {
    req = new Request();
    res = new Response(req);
    nextStub = sinon.stub();
    app = {
      router: {
        get: sinon.stub(),
        post: sinon.stub()
      }
    }
    sandbox = sinon.createSandbox();
    sandbox.stub(JourneyContext, 'putContext').callsFake();
  });

  afterEach(() => {
    sinon.restore();
    sandbox.restore();
  })

  it('should be a function', () => {
    assert.typeOf(page, 'function');
  });

  describe('/GET /multiple-job-select', () => {
    it('should render correct view with grant data', () => {
      req.session.grantSummary = { awardType: 'TRAVEL_IN_WORK'};
      req.casa.journeyContext = mockData;
      const router = page(app);
      const routeHandler = router.getPage;
      routeHandler(req, res, nextStub);
      expect(res.rendered.view).to.equal('pages/account/multiple-job-select.njk');
    });

    it('should redirect when uniqueGrants equals blank', () => {
     req.session.grantSummary = { awardType: 'TRAVEL_IN_WORK'};
      req.casa.journeyContext = {
        getDataForPage: () => {
          return {
            'account': {
              elements: [
 
              ],
            },
          };
        },
      };

      const router = page(app);
      const routeHandler = router.getPage;
      routeHandler(req, res, nextStub);

      expect(res.redirectedTo).to.equal('/claim/account/no-award-claims');
    });

    it('should redirect when uniqueGrants equals one', () => {
     req.session.grantSummary = { awardType: 'ADAPTATION_TO_VEHICLE'};
      req.casa.journeyContext = mockData;
      const router = page(app);
      const routeHandler = router.getPage;
      routeHandler(req, res, nextStub);
      expect(res.redirectedTo).to.equal('/claim/grant/grant-summary');
    });
  });

  describe('/POST /multiple-job-select', () => {
    it('should return an error when no option is selected (error)', () => {
      const expectedErrors = [{
        inline: 'multiple-job-select:errors.required',
        summary: 'multiple-job-select:errors.required'
      }];

      const expectedArray = [
        {
          text: 'multiple-job-select:errors.required',
          href: '#selectJob-hint'
        }
      ]

      req.session.grantSummary = { awardType: 'TRAVEL_IN_WORK'};
      req.casa.journeyContext = mockData;
      const router = page(app);
      const routeHandler = router.postPage;
      routeHandler(req, res, nextStub);
      expect(res.rendered.view).to.equal('pages/account/multiple-job-select.njk');
      expect(JSON.stringify(res.rendered.data.formErrors)).to.equal(JSON.stringify(expectedErrors));
      expect(JSON.stringify(res.rendered.data.formErrorsGovukArray)).to.equal(JSON.stringify(expectedArray));
    });

    it('should process valid input and redirect to grant-summary', () => {
      req.body = { selectJob: 'Travel in Work Music' };
      const router = page(app);
      const routeHandler = router.postPage;
      routeHandler(req, res, nextStub);
      expect(res.redirectedTo).to.equal('/claim/grant/grant-summary');
    });

    it('should process other option and redirect to contact-access-to-work', () => {
      req.body = { selectJob: 'other' };
      const router = page(app);
      const routeHandler = router.postPage;
      routeHandler(req, res, nextStub);
      expect(res.redirectedTo).to.equal('/claim/account/contact-access-to-work');
    });
  })
});