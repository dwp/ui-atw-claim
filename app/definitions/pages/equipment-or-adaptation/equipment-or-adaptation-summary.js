const fieldValidators = require('../../field-validators/equipment-or-adaptation/equipment-or-adaptation-summary');
const { restoreStateForPage, stashStateForPage } = require("../../../utils/stash-util");
const JourneyContext = require("@dwp/govuk-casa/lib/JourneyContext");
const hasUserWantedToAddAnotherEquipmentAdaptation = (req) => req.casa.journeyContext.getDataForPage('specialist-equipment-summary')?.addAnother === 'yes';
const userHasNotWantedToAddAnotherEquipmentAdaptation = (req) => req.casa.journeyContext.getDataForPage('specialist-equipment-summary')?.addAnother === 'no';
const logger = require("../../../logger/logger");
const log = logger('specialist-equipment:specialist-equipment-summary');
const { getChangeLinkCalculatorItemChange, getRemoveLinkCalculator } = require('../../../utils/link-util');
const { claimTypesShortName } = require('../../../config/claim-types');
const { calculateChangeLinkUrl } = getChangeLinkCalculatorItemChange(claimTypesShortName.EQUIPMENT_OR_ADAPTATION);
const { calculateRemoveLinkUrl } = getRemoveLinkCalculator(claimTypesShortName.EQUIPMENT_OR_ADAPTATION);

const restoreStateToBeforeUnsuccessfulAdditionOfNewEquipmentAdaptation = (req) => {
	restoreStateForPage(req, 'your-specialist-equipment');
};

const stashStateBeforeAdditionOfNewEquipmentAdaptation = (req) => {
	stashStateForPage(req, 'your-specialist-equipment');
};
// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/equipment-or-adaptation/equipment-or-adaptation-summary.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.hideBackButton = true;
      if (hasUserWantedToAddAnotherEquipmentAdaptation(req)) {
				req.casa.journeyContext.setDataForPage('specialist-equipment-summary', undefined);
				restoreStateToBeforeUnsuccessfulAdditionOfNewEquipmentAdaptation(req);
			}
      req.casa.journeyContext.setDataForPage('specialist-equipment-summary', undefined);
      req.casa.journeyContext.setDataForPage('remove-specialist-equipment', {
				removeId: true,
			});

      res.locals.allData = req.casa.journeyContext.getDataForPage('__hidden_specialist_equipment_page__');
			res.locals.calculateChangeLinkUrl = calculateChangeLinkUrl;
			res.locals.calculateRemoveLinkUrl = calculateRemoveLinkUrl;
      next();
    },
    postvalidate: (req, res, next) => {
      // If user wants to add another equipment adaptation clear users answers
      if (hasUserWantedToAddAnotherEquipmentAdaptation(req)) {
				req.casa.journeyContext.setDataForPage('remove-specialist-equipment', {
					removeId: false,
				});
        log.debug('Add another equipment adaptation');
				stashStateBeforeAdditionOfNewEquipmentAdaptation(req);
				JourneyContext.putContext(req.session, req.casa.journeyContext);

				req.session.save((err) => {
					if (err) {
						throw err;
					}
					return next();
				});
			} else if (userHasNotWantedToAddAnotherEquipmentAdaptation(req)) {
				req.casa.journeyContext.setDataForPage('remove-specialist-equipment', {
					removeId: false,
				});
        log.debug('No add another equipment adaptation');

				req.session.save((err) => {
					if (err) {
						throw err;
					}
					return next();
				});
			} else {
				next();
			}
    }
  },
});
