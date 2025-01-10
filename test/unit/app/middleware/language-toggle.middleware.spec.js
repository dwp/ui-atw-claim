const rewire = require('rewire');
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');
const middleware = rewire('../../../../app/middleware/language-toggle.middleware');

const sinon = require('sinon');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('languageToggleMiddleware', () => {
    const nextStub = sinon.stub();
    let req = new Request();
    let res = new Response(req);
    let app = { use: sinon.stub(),
    };

    beforeEach(() => {
      app = {
          use(mw) {
            this.use = mw;
          },
        };
      nextStub.reset();
      req = new Request();
      res = new Response(req);
    });

    it('should add a "use" middleware', () => {
    middleware(app);
    expect(app.use)
        .to
        .be
        .an
        .instanceOf(Function);
    });

    it('correctly builds url when (req.query).length is 0', () => {
        middleware(app).populateResLocals(req, res, nextStub);

        assert.equal(res.locals.languageUrlEn, '?lang=en')
        assert.equal(res.locals.languageUrlCy, '?lang=cy')
    });

    it('correctly builds url when (req.query).length > 0', () => {
        req.query = {
            id: '4',
        }

        middleware(app).populateResLocals(req, res, nextStub);

        assert.equal(res.locals.languageUrlEn, '?id=4&lang=en')
        assert.equal(res.locals.languageUrlCy, '?id=4&lang=cy')
    });

    it('correctly builds url for multiple (req.query) props', () => {
        req.query = {
            id: '4',
            testProp1: 'test1',
            testProp2: 'test2'
        }

        middleware(app).populateResLocals(req, res, nextStub);

        assert.equal(res.locals.languageUrlEn, '?id=4&testProp1=test1&testProp2=test2&lang=en')
        assert.equal(res.locals.languageUrlCy, '?id=4&testProp1=test1&testProp2=test2&lang=cy')
    });

    it('correctly sets res.locals.showLanguageToggle - ON', () => {
        middleware.__set__('SHOW_WELSH_LANGUAGE_TOGGLE', 'true')

        middleware(app).populateResLocals(req, res, nextStub);

        assert.equal(res.locals.showLanguageToggle, 'true')

    });

    it('correctly sets res.locals.showLanguageToggle - OFF', () => {
        middleware.__set__('SHOW_WELSH_LANGUAGE_TOGGLE', 'false')

        middleware(app).populateResLocals(req, res, nextStub);

        assert.equal(res.locals.showLanguageToggle, 'false')

    });
})