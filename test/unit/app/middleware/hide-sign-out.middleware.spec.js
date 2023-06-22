const hideSignOutMiddleware = require("../../../../app/middleware/hide-sign-out.middleware");
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');
const sinon = require('sinon');
const chai = require('chai');
const {
    expect,
    assert,
  } = chai;
chai.use(require('sinon-chai'));

describe('hideSignOutMiddleware', () => {

    const nextStub = sinon.stub();
    let req = new Request();
    let res = new Response(req);
    let app = { use: sinon.stub(),
    };

    beforeEach(() => {
        nextStub.reset();
        req = new Request();
        res = new Response(req);
      });

    it('should be a function', () => {
        assert.typeOf(hideSignOutMiddleware, 'function');
        expect(app.use).to.be.instanceOf(Function);
    });

    it('should hide sign-out button if url is public', () => {
        hideSignOutMiddleware(app).populateResLocals(req, res, nextStub);
        assert.equal(res.locals.hideSignOut, true);
    });

})

