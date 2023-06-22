const rewire = require('rewire');
const sinon = require('sinon');
const chai = require('chai');
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');
const {
  jwt,
  testGuid,
} = require('./test-data');
chai.use(require('sinon-chai'));
const {
  expect,
} = chai;
const helper = rewire('../../../../app/helpers/jwt-helper');
const jwtDecodeStub = sinon.stub();
helper.__set__('jwtDecode', jwtDecodeStub);

describe('utils: jwt-helper', async () => {
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
    jwtDecodeStub.reset();
  });
  it('should be a function', () => {
    expect(helper)
      .to
      .be
      .an
      .instanceOf(Function);
  });

  it('DTH - x-id-token', async () => {
    process.env.NODE_ENV = 'production';
    const headerStub = sinon.stub();
    req.header = headerStub;
    jwtDecodeStub.returns({ guid: testGuid });

    headerStub.returns(jwt);

    const guid = await helper(req);

    expect(guid)
      .to
      .equal(testGuid);
    expect(headerStub)
      .to
      .be
      .calledOnceWithExactly('x-id-token');
    expect(jwtDecodeStub)
      .to
      .be
      .calledOnceWithExactly(jwt);
  });

  it('Local Dev - req.session.token', async () => {
    process.env.NODE_ENV = 'other';
    const headerStub = sinon.stub();
    req.session.token = jwt;
    req.header = headerStub;

    jwtDecodeStub.returns({ guid: testGuid });

    const guid = await helper(req);

    expect(guid)
      .to
      .equal(testGuid);
    sinon.assert.notCalled(headerStub);
    expect(jwtDecodeStub)
      .to
      .be
      .calledOnceWithExactly(jwt);
  });

  it('No Auth - local', async () => {
    req.session.token = undefined;
    const guid = await helper(req);
    expect(guid)
      .to
      .equal(undefined);
    sinon.assert.notCalled(jwtDecodeStub);
  });

  it('No Auth - DTH', async () => {
    const headerStub = sinon.stub();
    req.header = headerStub;
    jwtDecodeStub.returns(undefined);
    const guid = await helper(req);

    expect(guid)
      .to
      .equal(undefined);
    sinon.assert.notCalled(jwtDecodeStub);
    sinon.assert.notCalled(headerStub);
  });

});
