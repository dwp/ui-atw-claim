const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/vehicle-adaptations/your-vehicle-adaptations');
const logger = require('../../../logger/logger');
const { removeAllSpaces, removeLeadingZero } = require('../../../utils/remove-all-spaces');
const { ADAPTATION_TO_VEHICLE_ROOT_URL } = require("../../../config/uri");
const log = logger('vehicle-adaptations:your-vehicle-adaptations');

module.exports = () => ({
  view: 'pages/vehicle-adaptations/your-vehicle-adaptations.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      // Change from summary not CYA
      const allData = req.casa.journeyContext.getDataForPage('__hidden_vehicle_adaptations_page__');
      if (req.query.changeClaim) {
        res.locals.hideBackButton = true;
        log.debug(`Change ${req.query.changeClaim}`);
        const dataToReloadForChange = allData[req.query.changeClaim];
        req.casa.journeyContext.setDataForPage('your-vehicle-adaptations', {
          item: dataToReloadForChange.claimDescription,
        });

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return next();
        });
      } else {
        const pageData = req.casa.journeyContext.getDataForPage('your-vehicle-adaptations');
        if (pageData === undefined) {
          res.locals.HEADER = res.locals.t('your-vehicle-adaptations:h1First');
          log.debug('Initial population');

          const data = {
            item: [{
              description: '',
              dateOfInvoice: {
                day: '',
                month: '',
                year: '',
              },
            }],
          };
          req.casa.journeyContext.setDataForPage('your-vehicle-adaptations', data);
          req.session.save((err) => {
            if (err) {
              throw err;
            }
            next();
          });
        } else {
          next();
        }
      }

      // From summary add another
      if (req.casa.journeyContext.getDataForPage('vehicle-adaptations-summary')?.addAnother === 'yes') {
        res.locals.hideBackButton = true;
        res.locals.HEADER = res.locals.t('your-vehicle-adaptations:h1Next');
        res.locals.casa.journeyPreviousUrl = `${ADAPTATION_TO_VEHICLE_ROOT_URL}/vehicle-adaptations-summary`;
        log.debug('Add another population')
        const data = {
          item: [{
            description: '',
            dateOfInvoice: {
              day: '',
              month: '',
              year: '',
            },
          }],
        };
        req.casa.journeyContext.setDataForPage('your-vehicle-adaptations', data);
      }

      if (req.inEditMode) {
        const keysLength = Object.keys(allData).length;
        if (keysLength === 0) {
          res.locals.index = 0;
        } else {
          res.locals.index = parseInt(Object.keys(allData)[keysLength - 1], 10) + 1;
        }
      } else {
        res.locals.index = req.casa.journeyContext.getDataForPage('your-vehicle-adaptations')?.monthIndex ?? '0';
      }
      next();
    },
    pregather: (req, res, next) => {
      log.info(req.body.item)
      Object.keys(req.body.item)
        .forEach((key) => {
          const index = parseInt(key, 10);
          const item = req.body.item[index];

          item.dateOfInvoice.dd = removeLeadingZero(item.dateOfInvoice.dd);
          item.dateOfInvoice.dd = removeAllSpaces(item.dateOfInvoice.dd);
          item.dateOfInvoice.mm = removeLeadingZero(item.dateOfInvoice.mm);
          item.dateOfInvoice.mm = removeAllSpaces(item.dateOfInvoice.mm);
          item.dateOfInvoice.yyyy = removeAllSpaces(item.dateOfInvoice.yyyy);
        });
      next();
    },
    preredirect: (req, res, next) => {
     if (req.inEditMode) {
        // Clear the previous page data for this screen to ensure the journey continues
        req.casa.journeyContext.setDataForPage('your-vehicle-adaptations', undefined);

        // Clear the yes that triggered the add another journey
        req.casa.journeyContext.setDataForPage('vehicle-adaptations-summary', undefined);
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect(`vehicle-adaptations-summary?edit=&editorigin=${req.editOriginUrl}`);
        });
      } else {
        next();
      }
    },
    postvalidate: (req, res, next) => {
      const allData = req.casa.journeyContext.getDataForPage('__hidden_vehicle_adaptations_page__');
      if (allData === undefined) {
        res.locals.index = '0';
      } else if (req.query.changeClaim) {
        res.locals.index = parseInt(req.query.changeClaim)
      } else {
        const keysLength = Object.keys(allData).length;
        res.locals.index = parseInt(Object.keys(allData)[keysLength - 1], 10) + 1
      }
      const data = req.casa.journeyContext.getDataForPage('your-vehicle-adaptations');
      const hiddenPage = req.casa.journeyContext.getDataForPage('__hidden_vehicle_adaptations_page__') ?? Object.create(null);
      hiddenPage[res.locals.index] = {
        claimDescription: data.item
      };

      req.casa.journeyContext.setDataForPage('__hidden_vehicle_adaptations_page__', hiddenPage);
      log.debug(req.casa.journeyContext.getDataForPage('__hidden_vehicle_adaptations_page__'));
      if (!req.inEditMode) {
        req.casa.journeyContext.setDataForPage('vehicle-adaptations-summary', undefined);
      }
      JourneyContext.putContext(req.session, req.casa.journeyContext);

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        return next();
      });
    }
  }
})
