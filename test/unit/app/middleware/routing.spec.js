const routing = require('../../../../app/middleware/routing')
const sinon = require('sinon');
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
})();

describe('routing', () => {
  let req;
  let res;
  let nextStub;
  const middleware = async (req, res, next) => { next() }
  const middlewareSpy = sinon.spy(middleware)
  beforeEach(() => {
    req = new Request();
    res = new Response(req);
    nextStub = sinon.stub();
    middlewareSpy.resetHistory()
  });

  it('should export an object with routing functions', () => {
      assert.typeOf(routing, 'object');
      assert.typeOf(routing.onlyAuthenticatedRoutes, 'function')
  });

  describe('onlyAuthenticatedRoutes', () => {
    const { onlyAuthenticatedRoutes } = routing
    describe('do not apply middlewhere when', () => {
      it('req.path is /', () => {
        req.path = '/';
        onlyAuthenticatedRoutes(middlewareSpy)(req, res, nextStub)

        expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        expect(middlewareSpy.called).to.be.false
      });

      it('req.path is /not-found', () => {
        req.path = '/not-found';
        onlyAuthenticatedRoutes(middlewareSpy)(req, res, nextStub)

        expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        expect(middlewareSpy.called).to.equal(false)
      });

      it('req.path is /problem-with-service', () => {
        req.path = '/problem-with-service';
        onlyAuthenticatedRoutes(middlewareSpy)(req, res, nextStub)

        expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        expect(middlewareSpy.called).to.equal(false)
      });
    })

    describe('do apply middlewhere when', () => {
      it('req.path is /account', () => {
        req.path = '/account';
        onlyAuthenticatedRoutes(middlewareSpy)(req, res, nextStub)

        expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();

        expect(middlewareSpy.called).to.be.true
      });

      it('req.path is /claim', () => {
        req.path = '/claim';
        onlyAuthenticatedRoutes(middlewareSpy)(req, res, nextStub)

        expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        expect(middlewareSpy.called).to.be.true
      });

      it('req.path is /support-worker', () => {
        req.path = '/support-worker';
        onlyAuthenticatedRoutes(middlewareSpy)(req, res, nextStub)

        expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        expect(middlewareSpy.called).to.be.true
      });

      it('req.path is /specialist-equipment', () => {
        req.path = '/specialist-equipment';
        onlyAuthenticatedRoutes(middlewareSpy)(req, res, nextStub)

        expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        expect(middlewareSpy.called).to.be.true
      });

      it('req.path is /travel-to-work', () => {
        req.path = '/travel-to-work';
        onlyAuthenticatedRoutes(middlewareSpy)(req, res, nextStub)

        expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        expect(middlewareSpy.called).to.be.true
      });

      it('req.path is /amend-workplace-contact', () => {
        req.path = '/amend-workplace-contact';
        onlyAuthenticatedRoutes(middlewareSpy)(req, res, nextStub)

        expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        expect(middlewareSpy.called).to.be.true
      });

      it('req.path is /personal', () => {
        req.path = '/personal';
        onlyAuthenticatedRoutes(middlewareSpy)(req, res, nextStub)

        expect(nextStub)
            .to
            .be
            .calledOnceWithExactly();
        expect(middlewareSpy.called).to.be.true
      });
    })
  }); 
});