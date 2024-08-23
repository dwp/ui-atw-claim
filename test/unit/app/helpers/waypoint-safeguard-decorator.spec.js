const sinon = require('sinon');
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');
const waypointSafeGuardDecorator = require('../../../../app/helpers/waypoint-safeguard-decorator');

const setupPageObject = () => ({
  view: 'pathToSomeView.njk',
  fieldValidators: {
    reviewed: ['collection', 'of', 'reviewed', 'fields']
  },
}) 

const setupPageObjectWithHooks = () => ({
  ...setupPageObject(),
  hooks: {
    presteer: (req, res, next) => {},
    poststeer: (req, res, next) => {},
    presanitise: (req, res, next) => {},
    postsanitise: (req, res, next) => {},
    pregather: (req, res, next) => {},
    postgather: (req, res, next) => {},
    prevalidate: (req, res, next) => {},
    postvalidate: (req, res, next) => {},
    preredirect: (req, res, next) => {},
    prerender: (req, res, next) => {},
  }
}) 

const simulateSideEffectMutatingWaypointsInSnapshot = (req) => {
    req.casa.preGatherTraversalSnapshot.splice(1)
}

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('utils: waypoint-safeguard-decorator', async () => {
  it(`should export an object with a 'decoratePage' function`, () => {
    assert.typeOf(waypointSafeGuardDecorator, 'object')
    assert.typeOf(waypointSafeGuardDecorator.decoratePage, 'function')
  });

  describe('decoratePage', () => {
    it('should preserve all fields of given page object', () => {
      const page = setupPageObject();
      const decoratedPage = waypointSafeGuardDecorator.decoratePage(page);
      expect(Object.keys(page)).to.deep.equals(Object.keys(decoratedPage))
    });

    it(`should not alter given page if the hooks field is 'undefined'`, () => {
      const page = setupPageObject();
      const decoratedPage = waypointSafeGuardDecorator.decoratePage(page);
      expect(page).to.deep.equals(decoratedPage);
    });

    it(`should enhance 'hooks' field if it exists`, () => {
      const page = setupPageObjectWithHooks();
      const decoratedPage = waypointSafeGuardDecorator.decoratePage(page);

      expect(page).to.not.deep.equals(decoratedPage)

      expect(page.hooks.prevalidate).to.not.equal(decoratedPage.hooks.prevalidate)
      expect(page.hooks.postvalidate).to.not.equal(decoratedPage.hooks.postvalidate)
    });

    it('should preserve waypoints even if something tries to break them', () => {
      const page = setupPageObjectWithHooks();
      const decoratedPage = waypointSafeGuardDecorator.decoratePage(page);

      const req = new Request();
      const res = new Response(req);
      const nextStub = sinon.stub();
      let preGatherTraversalSnapshotCacheMock = [];
      req.casa = {
        preGatherTraversalSnapshot: ['page-1', 'page-2', 'page-3'],
        journeyContext: {
          getDataForPage: () => {
            return preGatherTraversalSnapshotCacheMock;
          },
          setDataForPage: (req, data) => {
            preGatherTraversalSnapshotCacheMock = data;
          },
          getValidationErrors: sinon.stub(),
        },
      }

      decoratedPage.hooks.prevalidate(req, res, nextStub)

      simulateSideEffectMutatingWaypointsInSnapshot(req);

      decoratedPage.hooks.postvalidate(req, res, nextStub)

      expect(req.casa.preGatherTraversalSnapshot).to.deep.equal(['page-1', 'page-2', 'page-3'])
    });
  });
});