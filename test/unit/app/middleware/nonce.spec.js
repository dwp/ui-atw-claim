const rewire = require('rewire');
const nonce = rewire('../../../../app/middleware/nonce');
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');
const sinon = require('sinon');
const chai = require('chai');
const { assert } = require('chai');
const config = require('../../../../app/config/config-mapping');
const {
  expect,
} = chai;
chai.use(require('sinon-chai'));

describe('nonce', () => {
  const next = sinon.stub();

  beforeEach(() => {
    next.reset();
    nonce.__set__('crypto.randomBytes', sinon.stub()
      .returns('nonce'));
  });

  const req = new Request();
  const res = new Response(req);
  const cspHeaderName = 'Content-Security-Policy';
  res.headers = {
    [cspHeaderName]: cspHeaderName,
  };
  const app = {
    use: sinon.stub(),
  };

  it('should be a function', () => {
    assert.typeOf(nonce, 'function');
  });

  it('should call remove header if csp is off', () => {
    res.removeHeader = sinon.stub();
    nonce(app, false)
      .removeCSP(req, res, next);
    expect(res.removeHeader)
      .to
      .be
      .calledOnceWithExactly('Content-Security-Policy');

    expect(next)
      .to
      .be
      .calledOnceWithExactly();
  });

  it('should set nonce header and locals', () => {
    res.setHeader = sinon.stub();
    nonce(app, true)
      .generateCSP(req, res, next);
    expect(res.setHeader)
      .to
      .be
      .calledOnceWithExactly(cspHeaderName, `${cspHeaderName} 'nonce-nonce'`);
    expect(next)
      .to
      .be
      .calledOnceWithExactly();
    expect(res.locals.nonce)
      .to
      .be
      .equal('nonce');
  });
});
