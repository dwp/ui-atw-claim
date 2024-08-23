const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');
const ping = require('../../../../app/routes/ping');
const sinon = require('sinon');

let assert;
(async() => {
  assert = (await import ('chai')).assert;
})();

describe('/ping', () => {
  const req = new Request();
  const res = new Response(req);

  it('should be a function', () => {
    assert.typeOf(ping, 'function');
  });

  describe('when called', () => {
    let stubNext;
    let router;

    const casaRouter = () => {
      const routerObj = {};
      routerObj.use = (func) => func(req, res, stubNext);
      return routerObj;
    };

    beforeEach(() => {
      router = casaRouter();
      stubNext = sinon.stub();
    });

    it('return 204', () => {
      router.get = (path, callback) => {
        assert.equal(path, '/ping');
        callback(req, res);
      };

      ping(router);
      assert.equal(res.statusCode, 204);
    });
  });
});
