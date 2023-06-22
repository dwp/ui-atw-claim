const sinon = require('sinon');
const { expect } = require('chai').use(require('sinon-chai'));
const Request = require('../../../../helpers/fakeRequest.js');
const Response = require('../../../../helpers/fakeResponse.js');
const cookieDetailsGet = require('../../../../../app/routes/cookies/cookie-details.get.js');

const consentCookieName = 'consent';
const sessionCookieName = 'session';
const sessionTtl = 60;

describe('cookie/cookie-details', () => {
  describe('get', () => {
    it('should be an function', () => {
      expect(cookieDetailsGet).to.be.an.instanceOf(Function);
    });

    it('should return a function', () => {
      expect(cookieDetailsGet()).to.be.an.instanceOf(Function);
    });

    it('should render template with data', () => {
      const route = cookieDetailsGet( consentCookieName, sessionCookieName, sessionTtl);
      const req = new Request();
      const res = new Response(req);
      const renderStub = sinon.stub();
      res.render = renderStub;

      req.query.referrer = '/some/place/user/came/from'

      route(req, res);
      expect(renderStub).to.be.calledOnceWithExactly('pages/cookies/cookie-details.njk', {
        cookiePolicyUrl: 'cookie-policy',
        sessionMinutes: sessionTtl,
        consentCookieName,
        sessionCookieName,
        backLink: '/some/place/user/came/from',
        hideBackButton: true
      });
    });
  });
});
