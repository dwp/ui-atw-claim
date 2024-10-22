const rewire = require('rewire');
const sinon = require('sinon');
const Request = require('../../../helpers/fakeRequest.js');
const Response = require('../../../helpers/fakeResponse.js');
const { testGuid } = require('../helpers/test-data');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const cookieMessage = rewire('../../../../app/middleware/cookie-message.js');

const mount = '/';
const proxyMount = '/';
const cookieName = 'cookie-name';
const getGuidFromJwtStub = sinon.stub();

let expect;
(async() => {
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

cookieMessage.__set__('getGuidFromJwt', getGuidFromJwtStub);

describe('Middleware: cookie-message', async () => {
  let app;

  beforeEach(() => {
    getGuidFromJwtStub.reset();
    app = {
      use(mw) {
        this.use = mw;
      },
      post(p, mw) {
        this.all = mw;
      },
    };
  });

  it('should add a "use" middleware', async () => {
    cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
      proxyMount, false);
    expect(app.use)
      .to
      .be
      .an
      .instanceOf(Function);
  });

  it('should add an "all" middleware', async () => {
    cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
      proxyMount, false);
    expect(app.all)
      .to
      .be
      .an
      .instanceOf(Function);
  });

  describe('use: set template options middleware', async () => {
    it('should set cookieChoiceMade template variable', async () => {
      const req = new Request();
      const res = new Response(req);
      req.url = '/claim/account/home'
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        proxyMount, false);
      req.session.cookieChoiceMade = true;
      getGuidFromJwtStub.returns(undefined);

      await await app.use(req, res, async () => {});

      // No auth session so no identifier is set
      expect(res.locals.userIdentifier)
        .to
        .equal(undefined);

      expect(res.locals.currentUrl).to.equal("/claim/account/home")

      expect(res.locals)
        .to
        .have
        .property('cookieChoiceMade')
        .that
        .deep
        .equals(true);
    });

    it('should clear cookieChoiceMade from session after setting template variable', async () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        proxyMount, false);
      req.session.cookieChoiceMade = true;
      await app.use(req, res, async () => {});
      expect(req.session.cookieChoiceMade)
        .to
        .equal(undefined);
    });

    it('should add consent cookie value to template variable', async () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        proxyMount, false);
      req.cookies[cookieName] = 'test';
      await app.use(req, res, async () => {});
      expect(res.locals)
        .to
        .have
        .property('cookieMessage')
        .that
        .equals('test');
    });

    it('should add consent cookie value to template variable', async () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        proxyMount, false);
      req.cookies[cookieName] = 'test';
      getGuidFromJwtStub.returns(testGuid);
      await await app.use(req, res, async () => {});

      // Auth session in header as real DTH
      expect(res.locals.userIdentifier)
        .to
        .equal(4418574804073562);

      expect(res.locals)
        .to
        .have
        .property('cookieMessage')
        .that
        .equals('test');
    });

    it('should default consent cookie template variable to "unset"', async () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        proxyMount, false);
      await app.use(req, res, async () => {});
      expect(res.locals)
        .to
        .have
        .property('cookieMessage')
        .that
        .equals('unset');
    });

    it('should set consent submit URL template variable', async () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        proxyMount, false);
      await app.use(req, res, async () => {});
      expect(res.locals)
        .to
        .have
        .property('cookieConsentSubmit')
        .that
        .equals('cookie-consent');
    });

    it('should set cookie policy footer URL template variable', async () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        '/proxy/');
      req.originalUrl = '/proxy/start';
      req.url = '/start';
      await app.use(req, res, async () => {});
      expect(res.locals)
        .to
        .have
        .property('cookiePolicyUrl')
        .that
        .equals(`${mount}cookie-policy?referrer=%2Fstart`);
    });

    it('should not double up on referrer queries', async () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        '/proxy/');
      req.originalUrl = `/proxy${mount}cookie-policy?referrer=%2Fstart`;
      req.url = `${mount}cookie-policy?referrer=%2Fstart`;
      await app.use(req, res, async () => {});
      expect(res.locals)
        .to
        .have
        .property('cookiePolicyUrl')
        .that
        .equals(req.url);
    });

    it('should set strict Referrer-Policy header', async () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        proxyMount, false);
      await app.use(req, res, async () => {});
      expect(res.headers['Referrer-Policy'])
        .to
        .equal('same-origin');
    });
  });

  describe('all: handle submissions from consent banner', async () => {
    it('should set consent cookie if accept', async () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        proxyMount, false);
      req.body.cookieConsent = 'accept';
      await app.all(req, res, async () => {});
      expect(res.cookies)
        .to
        .have
        .property(cookieName)
        .that
        .equals('accept');
    });

    it('should set consent cookie if reject', async () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        proxyMount, false);
      req.body.cookieConsent = 'reject';
      await app.all(req, res, async () => {});
      expect(res.cookies)
        .to
        .have
        .property(cookieName)
        .that
        .equals('reject');
    });

    it('should remove ga cookies if reject', async () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        proxyMount, false);
      req.body.cookieConsent = 'reject';
      req.headers.cookie = '_ga';
      res.clearCookie = sinon.stub();
      await app.all(req, res, async () => {});
      expect(res.clearCookie)
        .to
        .be
        .calledWith('_ga');
    });

    it('should not set consent cookie if not accept or reject', async () => {
      const req = new Request();
      const res = new Response(req);
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        proxyMount, false);
      req.body.cookieConsent = 'bad';
      await app.all(req, res, async () => {});
      expect(res.cookies)
        .to
        .not
        .have
        .property(cookieName);
    });

    it('should redirect back to Referrer path', async () => {
      const req = new Request();
      const res = new Response(req);
      const sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();
      req.headers.Referrer = '/claims/page';
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        proxyMount, false);
      await app.all(req, res, async () => {});
      expect(res.redirectedTo)
        .to
        .equal('/claims/page');

      sandbox.restore();
    });

    it('should redirect back to only path on this domain', async () => {
      const req = new Request();
      const res = new Response(req);
      const sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();
      req.headers.Referrer = 'http://other-domain/claims/page';
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        proxyMount, false);
      await app.all(req, res, async () => {});
      expect(res.redirectedTo)
        .to
        .equal('/claims/page');
      sandbox.restore();
    });

    it('should redirect to / if referrer starts with "javascript:"', async () => {
      const req = new Request();
      const res = new Response(req);
      /* eslint-disable-next-line no-script-url */
      req.headers.Referrer = 'javascript:alert(1)';
      cookieMessage(app, cookieName, 'cookie-policy', 'cookie-consent', 'gtmdomain', mount,
        proxyMount, false);
      await app.all(req, res, async () => {});
      expect(res.redirectedTo)
        .to
        .equal('/');
    });
  });
});
