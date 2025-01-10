const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');
const sinon = require('sinon');
const stashUtil = require('../../../../app/utils/stash-util');

let expect;
(async() => {
  chai = await import ('chai');
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe('Utils: stash-utility', () => {
  let req;
  let res;
  let setDataForPageStub; 

  beforeEach(() => {
    req = new Request();
    res = new Response(req);
    setDataForPageStub = sinon.stub();
  });

  it('should export an object with four functions', () => {
    expect(stashUtil)
      .to
      .be
      .a('object');

    expect(stashUtil.stashStateForPage)
      .to
      .be
      .a('function');
    expect(stashUtil.restoreStateForPage)
      .to
      .be
      .a('function');
    expect(stashUtil.stashPreGatherSnapshot)
      .to
      .be
      .a('function');
    expect(stashUtil.restorePreGatherSnapshot)
      .to
      .be
      .a('function');
  });

  describe('stashStateForPage', () => {
    it('stashes data of a page', () => {
      const nameOfPageToBeStashed = 'page-to-be-stashed'
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === nameOfPageToBeStashed) {
              return {
                some: 'data'
              }
            }
          },
          setDataForPage: setDataForPageStub
        }
      };

      stashUtil.stashStateForPage(req, nameOfPageToBeStashed);

      expect(setDataForPageStub).to.be.calledOnceWithExactly(`${nameOfPageToBeStashed}-stash`, {some: 'data'}); 
    });
  });

  describe('restoreStateForPage', () => {
    it('restores data from the stash to its original page', () => {
      const nameOfPageToBeStashed = 'page-to-be-stashed'
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === `${nameOfPageToBeStashed}-stash`) {
              return {
                some: 'stashed data'
              }
            }
          },
          setDataForPage: setDataForPageStub
        }
      };

      stashUtil.restoreStateForPage(req, nameOfPageToBeStashed);

      expect(setDataForPageStub).to.be.calledWith(nameOfPageToBeStashed, {some: 'stashed data'}); 
    });

    it('empties the stash after restoring data', () => {
      const nameOfPageToBeStashed = 'page-to-be-stashed'
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === `${nameOfPageToBeStashed}-stash`) {
              return {
                some: 'stashed data'
              }
            }
          },
          setDataForPage: setDataForPageStub
        }
      };

      stashUtil.restoreStateForPage(req, nameOfPageToBeStashed);

      expect(setDataForPageStub).to.be.calledWith(`${nameOfPageToBeStashed}-stash`, undefined); 
    });

    it('returns the data that was in the stash', () => {
      const nameOfPageToBeStashed = 'page-to-be-stashed'
      req.casa = {
        journeyContext: {
          getDataForPage: (page) => {
            if (page === `${nameOfPageToBeStashed}-stash`) {
              return {
                some: 'stashed data'
              }
            }
          },
          setDataForPage: setDataForPageStub
        }
      };

      const data = stashUtil.restoreStateForPage(req, nameOfPageToBeStashed);

      expect(data).to.deep.equal({some: 'stashed data'})
    });
  });

  describe('stashPreGatherSnapshot', () => {
    it('should stash data if new waypoints have been traversed', () => {
      req.casa = {
        journeyContext: {
          getDataForPage: () => ['waypoint-1'],
          setDataForPage: setDataForPageStub
        },
        preGatherTraversalSnapshot: ['waypoint-1', 'waypoint-2', 'waypoint-3'],
      };

      stashUtil.stashPreGatherSnapshot(req);

      expect(setDataForPageStub).to.be.calledOnceWithExactly(
        '__hidden_pre_gather_traversal_snapshot_cache__',
       ['waypoint-1', 'waypoint-2', 'waypoint-3']); 
    });

    it('should not stash data if new waypoints have not been traversed', () => {
      req.casa = {
        journeyContext: {
          getDataForPage: () => ['waypoint-1'],
          setDataForPage: setDataForPageStub
        },
        preGatherTraversalSnapshot: ['waypoint-1'],
      };

      stashUtil.stashPreGatherSnapshot(req);

      expect(setDataForPageStub).to.not.been.called;
    });
  });

  describe('restorePreGatherSnapshot', () => {
    it('should set the preGatherSnapshot to what is inside the stash', () => {
      req.casa = {
        journeyContext: {
          getDataForPage: () => ['waypoint-1', 'waypoint-2', 'waypoint-3'],
          setDataForPage: setDataForPageStub
        },
        preGatherTraversalSnapshot: ['waypoint-1'],
      };

      stashUtil.restorePreGatherSnapshot(req);

      expect(req.casa.preGatherTraversalSnapshot).to.be.deep.equal(['waypoint-1', 'waypoint-2', 'waypoint-3']); 
    });
  });
});
