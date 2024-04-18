const { createGetRequest } = require('@dwp/govuk-casa/lib/utils/index');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/common/required-validator');

const {

  claimTypesFullName,
} = require('../../../config/claim-types');
const { mountURL } = require('../../../config/config-mapping');
const logger = require('../../../logger/logger');

const log = logger('common:check-your-answers');

const checkIfShouldShowSelectSavedPayee = (req, res) => {
  const { newPayee: wantsToAddNewPayee } = { ...req.casa.journeyContext.getDataForPage('__hidden_new_payee__') };
  const { account } = { ...req.casa.journeyContext.getDataForPage('__hidden_account__') };
  const hasExistingPayees = account.payees.length !== 0;

  res.locals.shouldShowSelectSavedPayee = hasExistingPayees && wantsToAddNewPayee;
};

module.exports = function reviewPageDefinition(
  pagesMetaEquipment = {},
  pagesMetaSupport = {},
  pagesMetaTravel = {},
  pagesMetaVehicle = {},
  pagesMetaTravelDuring = {}
) {
  return {
    view: 'pages/common/review/check-your-answers.njk',
    fieldValidators,
    hooks: {
      prerender(req, res, next) {
        const monthYear = req.casa.journeyContext.getDataForPage('support-month');
        if (monthYear) {
          const daysOfSupport = req.casa.journeyContext.getDataForPage('support-days').daysOfSupport;
          const daysOfSupportArray = [];

          for (let i = 0; i < daysOfSupport.length; i++) {
            const createDate = new Date (monthYear.dateOfSupport.yyyy, monthYear.dateOfSupport.mm -1, daysOfSupport[i]);
            const dayOfWeek = createDate.getDay();

            const dateDisplay = {
              'day': daysOfSupport[i],
              'weekday' : dayOfWeek,
              'month' : monthYear.dateOfSupport.mm
            }

            daysOfSupportArray.push(dateDisplay);

          };

          res.locals.daysOfSupport = daysOfSupportArray;
        }

        req.casa = req.casa || Object.create(null);

        // Determine active journey in order to define the "edit origin" URL,
        // and make journey data and errors available to templates
        const userJourney = req.casa.plan;
        checkIfShouldShowSelectSavedPayee(req, res);
        const { journeyOrigin } = req.casa;
        res.locals.changeUrlPrefix = `${res.locals.casa.mountUrl}${journeyOrigin.originId
        || ''}/`.replace(/\/+/g, '/');
        res.locals.journeyContext = req.casa.journeyContext.getData();
        res.locals.reviewErrors = req.casa.journeyContext.getValidationErrors();
        const { journeyType } = req.casa.journeyContext.getDataForPage('__journey_type__');
        res.locals.journeyType = journeyType;
        let pagesMeta;
        if (journeyType === claimTypesFullName.EA) {
          pagesMeta = pagesMetaEquipment;
        } else if (journeyType === claimTypesFullName.SW) {
          pagesMeta = pagesMetaSupport;
        } else if (journeyType === claimTypesFullName.TW) {
          pagesMeta = pagesMetaTravel;
        } else if (journeyType === claimTypesFullName.AV) {
          pagesMeta = pagesMetaVehicle;
        } else if (journeyType === claimTypesFullName.TIW) {
          pagesMeta = pagesMetaTravelDuring;
        } else {
          throw Error('Unsupported journey type');
        }

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

        if (req.casa.journeyContext.getDataForPage('__previous_claim__') !== undefined) {
          log.debug('Amend claim detected');
          res.locals.previousClaimId = req.casa.journeyContext.getDataForPage(
            '__previous_claim__',
          ).claimId;
          res.locals.previousClaimType = req.casa.journeyContext.getDataForPage(
            '__previous_claim__',
          ).claimType;
        }

        next();
      },
      prevalidate(req, res, next) {
        const { journeyType } = req.casa.journeyContext.getDataForPage('__journey_type__');

        if (req.body.remove !== undefined) {
          if (journeyType === claimTypesFullName.SW) {
            req.casa.journeyContext.setDataForPage('remove-support-month', {
              removeId: req.body.remove,
            });
            req.casa.journeyContext.setDataForPage('support-claim-summary', undefined);
            JourneyContext.putContext(req.session, req.casa.journeyContext);

            req.session.save((err) => {
              if (err) {
                throw err;
              }
              return res.redirect(`remove-support-month?edit=&editorigin=${req.editOriginUrl}`);
            });
          } else if (journeyType === claimTypesFullName.TW) {
            req.casa.journeyContext.setDataForPage('remove-travel-month', {
              removeId: req.body.remove,
            });
            req.casa.journeyContext.setDataForPage('journey-summary', undefined);
            JourneyContext.putContext(req.session, req.casa.journeyContext);

            req.session.save((err) => {
              if (err) {
                throw err;
              }
              return res.redirect(`remove-travel-month?edit=&editorigin=${req.editOriginUrl}`);
            });
          }
          res.locals.journeyType = journeyType;
        } else {
          next();
        }
      },
      postvalidate: (req, res) => {
        JourneyContext.putContext(req.session, req.casa.journeyContext);
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect(`${mountURL}declaration`);
        });
      },
    },
  };
};
