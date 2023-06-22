const middleware = require('../../../../app/middleware/journey-type.middleware');
const sinon = require('sinon');
const chai = require('chai');
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');
const { claimTypesFullName } = require('../../../../app/config/claim-types');
chai.use(require('sinon-chai'));
const {
  expect,
} = chai;

describe('Middleware: journey-type', () => {
  let app;
  let req;
  let res;
  let nextStub;
  beforeEach(() => {
    app = {
      use(mw) {
        this.use = mw;
      },
    };
    req = new Request();
    res = new Response(req);
    nextStub = sinon.stub();
  });

  it('should add a "use" middleware', () => {
    middleware(app);
    expect(app.use)
      .to
      .be
      .an
      .instanceOf(Function);
  });

  describe('apply middleware', () => {
    it('should inject journey types on all routes', () => {
      req.path = '/foo';

      middleware(app);
      app.use(req, res, nextStub);

      expect(res.locals.ea)
        .to
        .eql(claimTypesFullName.EA);
      expect(res.locals.sw)
        .to
        .eql(claimTypesFullName.SW);
      expect(res.locals.ttw)
        .to
        .eql(claimTypesFullName.TW);
      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly();
    });
  });

  it('should inject journey types even when journeyContext is undefined', () => {
    req.casa.journeyContext = undefined;

    middleware(app);
    app.use(req, res, nextStub);

    expect(res.locals.ea)
      .to
      .eql(claimTypesFullName.EA);
    expect(res.locals.sw)
      .to
      .eql(claimTypesFullName.SW);
    expect(res.locals.ttw)
      .to
      .eql(claimTypesFullName.TW);
    expect(nextStub)
      .to
      .be
      .calledOnceWithExactly();
  });

  describe('injectJourneyTypeHelpers', () => {
    it(`isOnJourney helpers should be set correctly if journeyType is ${claimTypesFullName.EA}`,
      () => {
        req.casa.journeyContext = {
          getDataForPage: (page) => {
            if (page === '__journey_type__') {
              return {
                journeyType: claimTypesFullName.EA,
              };
            }
            return undefined;
          },
        };

        middleware(app);
        app.use(req, res, nextStub);

        expect(res.locals.isOnEaJourney).to.be.true;
        expect(res.locals.isOnSwJourney).to.be.false;
        expect(res.locals.isOnTtwJourney).to.be.false;

        expect(nextStub)
          .to
          .be
          .calledOnceWithExactly();
      });

    it(`isOnJourney helpers should be set correctly if journeyType is 'undefined'`, () => {
      req.casa.journeyContext = {
        getDataForPage: () => {
          return undefined;
        },
      };

      middleware(app);
      app.use(req, res, nextStub);

      expect(res.locals.isOnEaJourney).to.be.false;
      expect(res.locals.isOnSwJourney).to.be.false;
      expect(res.locals.isOnTtwJourney).to.be.false;

      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly();
    });
  });
});
