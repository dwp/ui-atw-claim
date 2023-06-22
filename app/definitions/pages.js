/**
 * Declarative definitions of pages within a user journey.
 */

const pageIndex = require('./pages/index');
const logger = require('../logger/logger');

const { decoratePage } = require('../helpers/waypoint-safeguard-decorator');

const log = logger('definitions:pages');

const decoratePagesWithWaypointSafeGuard = (allPages) => {
  const decoratedPages = {};
  Object.keys(allPages)
    .forEach((pageName) => {
      decoratedPages[pageName] = decoratePage(allPages[pageName]);
    });

  log.debug('Page definitions loaded, %s pages added', Object.keys(decoratedPages).length);
  return decoratedPages;
};

const loadPageDefinitions = () => {
  log.debug('Loading page definitions');

  const allPages = pageIndex();

  return decoratePagesWithWaypointSafeGuard(allPages);
};

module.exports = loadPageDefinitions;
