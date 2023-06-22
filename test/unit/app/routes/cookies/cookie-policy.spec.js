const sinon = require('sinon');
const { expect } = require('chai').use(require('sinon-chai'));
const { CONSENT_COOKIE_NAME } = require('../../../../../app/config/constants.js');
const Request = require('../../../../../test/helpers/fakeRequest');
const Response = require('../../../../../test/helpers/fakeResponse');
const cookiePolicyGet = require('../../../../../app/routes/cookies/cookie-policy.get.js');
const cookiePolicyPost = require('../../../../../app/routes/cookies/cookie-policy.post.js');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

describe('cookies/cookie-policy', () => {
  let req, res;
  const renderStub = sinon.stub();

  beforeEach(() => {
    req = new Request();
    res = new Response(req);

    req.query = {
      referrer: '/some/path/user/came/from'
    }
    renderStub.reset();
  })
  const mountUrl = '/claim/'
  describe('get', () => {
    it('should be an function', () => {
      expect(cookiePolicyGet).to.be.an.instanceOf(Function);
    });

    it('should return a function', () => {
      expect(cookiePolicyGet()).to.be.an.instanceOf(Function);
    });

    it('should render template with data', () => {
      const route = cookiePolicyGet();
      res.render = renderStub;

      route(req, res);
      expect(renderStub).to.be.calledOnceWithExactly('pages/cookies/cookie-policy.njk', {
        formErrorsGovukArray: undefined,
        formErrors: undefined,
        backLink: '/some/path/user/came/from',
        hideBackButton: true
      });
    });

    it('should render template with data including errors if in session', () => {
      const route = cookiePolicyGet();

      res.render = renderStub;
      res.locals.t = (k) => k;
      req.session.cookieConsentError = 'error';
      route(req, res);
      expect(renderStub).to.be.calledOnceWithExactly('pages/cookies/cookie-policy.njk', {
        formErrorsGovukArray: [{
          text: 'error',
          href: '#f-cookieConsent',
        }],
        formErrors: {
          cookieConsent: [{
            summary: 'error',
            inline: 'error',
          }],
        },
        backLink: '/some/path/user/came/from',
        hideBackButton: true
      });
    });

    it('should clear error from session', () => {
      const route = cookiePolicyGet();

      res.render = sinon.stub();
      res.locals.t = (k) => k;
      req.session.cookieConsentError = 'error';
      route(req, res);
      expect(req.session.cookieConsentError).to.equal(undefined);
    });
  });

  describe('post', () => {

    let sandbox;
    beforeEach(() => {
      sandbox = sinon.createSandbox();
      sandbox.stub(JourneyContext, 'putContext').callsFake();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should be an function', () => {
      expect(cookiePolicyPost).to.be.an.instanceOf(Function);
    });

    it('should return a function', () => {
      expect(cookiePolicyPost(CONSENT_COOKIE_NAME)).to.be.an.instanceOf(Function);
    });

    it('should add error to session and redirect back if req.body.cookieConsent is undefined', () => {
      const route = cookiePolicyPost(CONSENT_COOKIE_NAME, mountUrl);

      req.url = 'test';
      route(req, res);
      expect(req.session.cookieConsentError).to.equal('cookie-policy:field.cookieConsent.required');
      expect(res.redirectedTo).to.equal('/claim/test');
    });

    it('should add error to session and redirect back if req.body.cookieConsent is not accept or reject', () => {
      const route = cookiePolicyPost(CONSENT_COOKIE_NAME, mountUrl);

      req.url = 'test';
      req.body.cookieConsent = 'wrong';
      route(req, res);
      expect(req.session.cookieConsentError).to.equal('cookie-policy:field.cookieConsent.required');
      expect(res.redirectedTo).to.equal('/claim/test');
    });

    it('should update consent cookie if req.body.cookieConsent is accept or reject', () => {
      const route = cookiePolicyPost(CONSENT_COOKIE_NAME, mountUrl);

      req.body.cookieConsent = 'accept';
      route(req, res);
      expect(res.cookies).to.have.property(CONSENT_COOKIE_NAME).that.equals('accept');
    });

    it('should remove ga cookies if req.body.cookieConsent is reject', () => {
      const route = cookiePolicyPost(CONSENT_COOKIE_NAME, mountUrl);

      req.body.cookieConsent = 'reject';
      req.headers.cookie = '_gat';
      res.clearCookie = sinon.stub();
      route(req, res);
      expect(res.clearCookie).to.be.calledWith('_ga');
      expect(res.clearCookie).to.be.calledWith('_gat');
      expect(res.clearCookie).to.be.calledWith('_gid');
    });

    it('should redirect back to backLink after submitting the form', () => {
      const route = cookiePolicyPost(CONSENT_COOKIE_NAME, mountUrl);

      req.body.cookieConsent = 'accept';
      route(req, res);
      expect(res.redirectedTo).to.equal('/some/path/user/came/from');
    });
  });
});
