const { createGetRequest } = require('@dwp/govuk-casa/lib/utils/index');
const fieldValidators = require('../../../field-validators/common/optional-validator');

const { PERSONAL_INFORMATION_URL } = require('../../../../config/uri');
const { restoreStateForPage } = require('../../../../utils/stash-util');

const getOrRestoreDataForPage = (req, pageName) => {
  const data = req.casa.journeyContext.getDataForPage(pageName);
  if (!data) {
    return restoreStateForPage(req, pageName);
  }
  return data;
};

const hasUserModifiedData = (req) => {
  const { journeyContext } = req.casa;

  const { account } = journeyContext.getDataForPage('__hidden_account__');

  const {
    homeNumber,
  } = getOrRestoreDataForPage(req, 'new-phone-number');

  const {
    mobileNumber,
  } = getOrRestoreDataForPage(req, 'new-mobile-number');

  const isAccountDataEqual = () => homeNumber === account.claimant.homeNumber
          && mobileNumber === account.claimant.mobileNumber;

  return !isAccountDataEqual();
};

module.exports = function reviewPageDefinition(
  pagesMeta = {},
) {
  return {
    view: 'pages/account/personal/telephone-number-change.njk',
    fieldValidators,
    hooks: {
      prerender(req, res, next) {
        req.casa = req.casa || Object.create(null);
        res.locals.forceShowBackButton = true;
        // Determine active journey in order to define the "edit origin" URL,
        // and make journey data and errors available to templates
        const userJourney = req.casa.plan;
        const { journeyOrigin } = req.casa;
        res.locals.changeUrlPrefix = `${res.locals.casa.mountUrl}${journeyOrigin.originId
        || ''}/`.replace(/\/+/g, '/');
        res.locals.journeyContext = req.casa.journeyContext.getData();
        res.locals.reviewErrors = req.casa.journeyContext.getValidationErrors();

        // Determine which pages have been traversed in the user's journey in
        // order to get to this review point (not all journey waypoints will
        // have been touched, but may contain data which needs to be ignored)

        const traversalOptions = {
          startWaypoint: journeyOrigin.waypoint,
        };

        const waypointsTraversed = userJourney.traverse(req.casa.journeyContext, traversalOptions);

        res.locals.reviewBlocks = waypointsTraversed.map((waypointId) => {
          const meta = pagesMeta[waypointId] || Object.create(null);
          return meta.reviewBlockView ? {
            waypointId,
            waypointEditUrl: createGetRequest({
              mountUrl: res.locals.casa.mountUrl,
              waypoint: `${journeyOrigin.originId || ''}/${waypointId}`,
              editMode: true,
              editOrigin: req.editOriginUrl,
              contextId: req.casa.journeyContext.identity.id,
            }),
            reviewBlockView: meta.reviewBlockView,
          } : null;
        })
          .filter((o) => o !== null);

        const dataWasModified = hasUserModifiedData(req);

        res.locals.hideContinueButton = !dataWasModified;

        res.locals.casa.journeyPreviousUrl = `${PERSONAL_INFORMATION_URL}/change-personal-details`;
        next();
      },
      preredirect: (req, res) => {
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect(`${PERSONAL_INFORMATION_URL}/change-personal-details`);
        });
      },
    },
  };
};
