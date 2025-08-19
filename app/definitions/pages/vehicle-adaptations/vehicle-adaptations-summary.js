const fieldValidators = require('../../field-validators/vehicle-adaptations/vehicle-adaptations-summary');
const { restoreStateForPage, stashStateForPage } = require("../../../utils/stash-util");
const logger = require("../../../logger/logger");
const JourneyContext = require("@dwp/govuk-casa/lib/JourneyContext");
const { claimTypesShortName } = require('../../../config/claim-types');
const { getChangeLinkCalculatorItemChange, getRemoveLinkCalculator } = require('../../../utils/link-util');
const log = logger('vehicle-adaptations:vehicle-adaptations-summary');
const hasUserWantedToAddAnotherVehicleAdaptation = (req) => req.casa.journeyContext.getDataForPage('vehicle-adaptations-summary')?.addAnother === 'yes';
const userHasNotWantedToAddAnotherVehicleAdaptation = (req) => req.casa.journeyContext.getDataForPage('vehicle-adaptations-summary')?.addAnother === 'no';
const { calculateChangeLinkUrl } = getChangeLinkCalculatorItemChange(claimTypesShortName.ADAPTATION_TO_VEHICLE);
const { calculateRemoveLinkUrl } = getRemoveLinkCalculator(claimTypesShortName.ADAPTATION_TO_VEHICLE);

const restoreStateToBeforeUnsuccessfulAdditionOfNewVehicleAdaptation = (req) => {
	restoreStateForPage(req, 'your-vehicle-adaptation');
};

const stashStateBeforeAdditionOfNewVehicleAdaptation = (req) => {
	stashStateForPage(req, 'your-vehicle-adaptation');
};

 
module.exports = () => ({
	view: 'pages/vehicle-adaptations/vehicle-adaptations-summary.njk',
	fieldValidators,
	reviewBlockView: 'pages/vehicle-adaptations/review/adaptation-to-vehicle-claim-information.njk',
	hooks: {
		prerender: (req, res, next) => {
			res.locals.hideBackButton = true;
			if (hasUserWantedToAddAnotherVehicleAdaptation(req)) {
				req.casa.journeyContext.setDataForPage('vehicle-adaptations-summary', undefined);
				restoreStateToBeforeUnsuccessfulAdditionOfNewVehicleAdaptation(req);
			}
			req.casa.journeyContext.setDataForPage('vehicle-adaptations-summary', undefined);
			req.casa.journeyContext.setDataForPage('remove-vehicle-adaptation', {
				removeId: true,
			});
			const allData = req.casa.journeyContext.getDataForPage('__hidden_vehicle_adaptations_page__');
			res.locals.allData = allData;
			res.locals.calculateChangeLinkUrl = calculateChangeLinkUrl;
			res.locals.calculateRemoveLinkUrl = calculateRemoveLinkUrl;
			next();
		},
		postvalidate: (req, res, next) => {
			// If user wants to add another vehicle adaptation clear users answers
			log.debug('post validate');
			if (hasUserWantedToAddAnotherVehicleAdaptation(req)) {
				log.debug('Add another vehicle adaptation');
				req.casa.journeyContext.setDataForPage('remove-vehicle-adaptation', {
					removeId: false,
				});
				stashStateBeforeAdditionOfNewVehicleAdaptation(req);
				JourneyContext.putContext(req.session, req.casa.journeyContext);

				req.session.save((err) => {
					if (err) {
						throw err;
					}
					return next();
				});
			} else if (userHasNotWantedToAddAnotherVehicleAdaptation(req)) {
				req.casa.journeyContext.setDataForPage('remove-vehicle-adaptation', {
					removeId: false,
				});
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
