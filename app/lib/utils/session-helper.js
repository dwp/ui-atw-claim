const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const logger = require('../../logger/logger');

const log = logger('lib:utils:session-helper');
function setupSessionAfterReset(req, account, jwt, guid) {
  log.debug('setupSessionAfterReset');
  const jc = new JourneyContext(
    {
      __hidden_account__: { account },
      __guid__: { guid },
    },
    {},
    { language: 'en' },
    { id: 'default' },
  );

  JourneyContext.removeContexts(req.session);
  JourneyContext.putContext(req.session, jc);

  req.session.token = jwt;
}

function saveSessionAndRenderNextPage(req, res, nextPageViewFile) {
  JourneyContext.putContext(req.session, req.casa.journeyContext);
  req.session.save((err) => {
    if (err) {
      throw err;
    }
    res.locals.noNextButton = true;
    res.render(nextPageViewFile);
  });
}

function endSession(casaApp, req, res, nextPageViewFile) {
  log.debug('endSession');
  casaApp.endSession(req)
    .then(() => {
      saveSessionAndRenderNextPage(req, res, nextPageViewFile);
    });
}

/* jwt will be present and preserved only locally.
  It will be undefined in production, which is
  acceptable since any field is undefined by default */
function endSessionWhilePreservingAccountData(casaApp, req, res, nextPageViewFile) {
  log.debug('endSessionWhilePreservingAccountData');
  const { account } = req.casa.journeyContext.getDataForPage('__hidden_account__');
  const { guid } = req.casa.journeyContext.getDataForPage('__guid__');
  const jwt = req.session.token;

  casaApp.endSession(req)
    .then(() => {
      setupSessionAfterReset(req, account, jwt, guid);
      saveSessionAndRenderNextPage(req, res, nextPageViewFile);
    });
}

module.exports = {
  endSession,
  endSessionWhilePreservingAccountData,
};
