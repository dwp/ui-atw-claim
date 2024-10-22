const middleware = require('../../../../app/middleware/url.middleware');
const sinon = require('sinon');
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');

let expect;
(async() => {
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('Middleware: url', () => {
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

  it('Should set correct url for feedbackFormDirectUrl', () => {
    middleware(app);
    app.use(req, res, nextStub);
    expect(res.locals.feedbackFormDirectUrl)
    .to
    .eql('https://forms.office.com/Pages/ResponsePage.aspx?id=DpxP-knna0i8NIr6EGM3VuwrnvhrRvxJss4aoToy8JRUMTVBQ0I3SjlDM0RSQzVGTkQzUEpJQ09UWC4u')
  })

  it('Should set correct url for acessibilityStatementUrl', () => {
    res.locals.currentUrl = 'someUrl';
    middleware(app);
    app.use(req, res, nextStub);
    expect(res.locals.acessibilityStatementUrl)
        .to
        .eql('/claim/public/accessibility-statement?referrer=someUrl')
  })

  it('should set accountBaseUrl', () => {
    middleware(app);
    app.use(req, res, nextStub);
    expect(res.locals.accountBaseUrl)
    .to
    .eql('/claim/account')
  })

  it('should set personalBaseUrl', () => {
    middleware(app);
    app.use(req, res, nextStub);
    expect(res.locals.personalBaseUrl)
    .to
    .eql('/claim/personal')
  })
});
