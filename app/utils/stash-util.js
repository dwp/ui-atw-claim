const logger = require('../logger/logger');

const log = logger('utils:stash-util');

const stashStateForPage = (req, pageName) => {
  const oldState = req.casa.journeyContext.getDataForPage(pageName);

  req.casa.journeyContext.setDataForPage(`${pageName}-stash`, oldState);
};

const restoreStateForPage = (req, pageName) => {
  const stashPageName = `${pageName}-stash`;
  const stash = req.casa.journeyContext.getDataForPage(stashPageName);
  if (stash) {
    req.casa.journeyContext.setDataForPage(pageName, stash);
    req.casa.journeyContext.setDataForPage(stashPageName, undefined);
  }
  return stash;
};

const setPreGatherSnapshotCache = (req, data) => req.casa.journeyContext.setDataForPage('__hidden_pre_gather_traversal_snapshot_cache__', data);

const getPreGatherSnapshotCache = (req) => {
  const cache = req.casa.journeyContext.getDataForPage(
    '__hidden_pre_gather_traversal_snapshot_cache__',
  );

  if (!cache) {
    setPreGatherSnapshotCache(req, []);
    return [];
  }

  return cache;
};

const stashPreGatherSnapshot = (req) => {
  log.debug('stashPreGatherSnapshot');
  if (getPreGatherSnapshotCache(req).length < req.casa.preGatherTraversalSnapshot.length) {
    log.debug(`preGatherTraversalSnapshot ${getPreGatherSnapshotCache(req).length} shorter than 
    req.casa.preGatherTraversalSnapshot.length ${req.casa.preGatherTraversalSnapshot.length}`);
    setPreGatherSnapshotCache(req, [...req.casa.preGatherTraversalSnapshot]);
  }
};

const restorePreGatherSnapshot = (req) => {
  log.debug('restorePreGatherSnapshot');
  req.casa.preGatherTraversalSnapshot = getPreGatherSnapshotCache(req);
};

module.exports = {
  stashStateForPage,
  restoreStateForPage,
  stashPreGatherSnapshot,
  restorePreGatherSnapshot,
};
