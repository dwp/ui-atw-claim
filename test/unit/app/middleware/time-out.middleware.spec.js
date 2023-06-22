const rewire = require('rewire');
const sinon = require('sinon');
const chai = require('chai');
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');
const timeOutConfig = require('../../../../app/config/time-out')
chai.use(require('sinon-chai'));
const {
  expect,
} = chai;

const middleware = rewire('../../../../app/middleware/time-out.middleware');
const mockTimeOutConfig = {
  totalSessionTimeInSeconds: 1,
  timeAfterWhichToShowWarningInSeconds: 0.1,
  signOutUrl: '/foo/bar',
}

const waitForSeconds = async (secondsToWait) => {
  await new Promise(resolve => setTimeout(resolve, secondsToWait * 1000));
}

const setupRequest = () => {
  const req = new Request();
  req.app = { locals: {} };
  return req;
}

describe('Middleware: time-out', () => {
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
    req = setupRequest(); 
    res = new Response(req);
    nextStub = sinon.stub();
    middleware.__set__('timeOutConfig', mockTimeOutConfig )
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
    it('should inject time-out config if we are on an authed route', () => {
      req.path = '/account/home';

      middleware(app);
      app.use(req, res, nextStub);
      
      expect(res.locals.timeOut).to.eql({...mockTimeOutConfig, shouldTimeOut: true})
      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly();
      });

    it('should not inject time-out config if we are not on an authed route', () => {
      req.path = '/foo';

      middleware(app);
      app.use(req, res, nextStub);
      
      expect(res.locals.timeOut).to.be.undefined;
      expect(nextStub)
        .to
        .be
        .calledOnceWithExactly();
      });
    });

    it(`should set a flag to display the no-js timeout-warning banner if the user has not interacted with our service for ${timeOutConfig.timeAfterWhichToShowWarningInSeconds} seconds`, async () => {
      req.path = '/account/home';

      const numberOfSecondsToSimulateBeingIdle = mockTimeOutConfig.timeAfterWhichToShowWarningInSeconds * 2;

      middleware(app);
      app.use(req, res, nextStub);
      await waitForSeconds(numberOfSecondsToSimulateBeingIdle);
      expect(req.app.locals.shouldDisplayNoJsTimeoutWarningBanner).to.be.true;
    })

    it(`should unset a flag to hide the no-js timeout-warning banner if the user has interacted with the service within ${timeOutConfig.timeAfterWhichToShowWarningInSeconds} seconds`, async () => {
      req.path = '/account/home/some/page';

      const mockTimeOutConfig = {
        totalSessionTimeInSeconds: 2,
        timeAfterWhichToShowWarningInSeconds: 1,
        signOutUrl: '/foo/bar',
      }
      middleware.__set__('timeOutConfig', mockTimeOutConfig);
      const numberOfSecondsToSimulateNotBeingIdle = mockTimeOutConfig.timeAfterWhichToShowWarningInSeconds / 2

      middleware(app);
      app.use(req, res, nextStub);
      await waitForSeconds(numberOfSecondsToSimulateNotBeingIdle);
      expect(req.app.locals.shouldDisplayNoJsTimeoutWarningBanner).to.be.false;
    })
});
