const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/equipment-or-adaptation/your-equipment-or-adaptation');
const { removeAllSpaces, removeLeadingZero } = require('../../../utils/remove-all-spaces');
const { EQUIPMENT_OR_ADAPTATION_ROOT_URL } = require('../../../config/uri');

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/equipment-or-adaptation/your-equipment-or-adaptation.njk',
  fieldValidators,
  reviewBlockView: 'pages/equipment-or-adaptation/review/equipment.njk',
  hooks: {
    prerender: (req, res, next) => {
      const allData = req.casa.journeyContext.getDataForPage('__hidden_specialist_equipment_page__');
      if (req.query.changeClaim) {
        res.locals.hideBackButton = true;
        const dataToReloadForChange = allData[req.query.changeClaim];
        req.casa.journeyContext.setDataForPage('your-specialist-equipment', {
          item: dataToReloadForChange
      });
        
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return next();
        })
      } else {
        const pageData = req.casa.journeyContext.getDataForPage('your-specialist-equipment');
        if (pageData === undefined) {

          const data = {
            item: [{
              description: '',
              dateOfPurchase: {
                day: '',
                month: '',
                year: '',
              },
            }],
          };

          req.casa.journeyContext.setDataForPage('your-specialist-equipment', data);

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
      if (req.casa.journeyContext.getDataForPage('specialist-equipment-summary')?.addAnother === 'yes') {
        res.locals.hideBackButton = true;
        res.locals.HEADER = res.locals.t('your-speciliast-equipment:h1Next');
        res.locals.casa.journeyPreviousUrl = `${EQUIPMENT_OR_ADAPTATION_ROOT_URL}/specialist-equipment-summary`;
      
        const data = {
          item: [{
            description: '',
            dateOfPurchase: {
              day: '',
              month: '',
              year: '',
            },
          }],
        };
        req.casa.journeyContext.setDataForPage('your-specialist-equipment', data);
      }

      if (req.inEditMode) {
        const keysLength = Object.keys(allData).length;
        if (keysLength === 0) {
          res.locals.index = 0;
        } else {
          res.locals.index = parseInt(Object.keys(allData)[keysLength - 1], 10) + 1;
        }
      } else {
        res.locals.index = req.casa.journeyContext.getDataForPage('your-specialist-equipment')?.monthIndex ?? '0';
      }
      next();
    },
    pregather: (req, res, next) => {
      Object.keys(req.body.item)
        .forEach((key) => {
          const index = parseInt(key, 10);
          const item = req.body.item[index];

          item.dateOfPurchase.dd = removeAllSpaces(item.dateOfPurchase.dd);
          item.dateOfPurchase.dd = removeLeadingZero(item.dateOfPurchase.dd);
          item.dateOfPurchase.mm = removeAllSpaces(item.dateOfPurchase.mm);
          item.dateOfPurchase.mm = removeLeadingZero(item.dateOfPurchase.mm);
          item.dateOfPurchase.yyyy = removeAllSpaces(item.dateOfPurchase.yyyy);
          item.dateOfPurchase.yyyy = removeLeadingZero(item.dateOfPurchase.yyyy);
        });
      next();
    },
    preredirect: (req, res, next) => {
      if (req.inEditMode) {
         // Clear the previous page data for this screen to ensure the journey continues
         req.casa.journeyContext.setDataForPage('your-specialist-equipment', undefined);
 
         // Clear the yes that triggered the add another journey
         req.casa.journeyContext.setDataForPage('specialist-equipment-summary', undefined);
         JourneyContext.putContext(req.session, req.casa.journeyContext);
 
         req.session.save((err) => {
           if (err) {
             throw err;
           }
           res.redirect(`specialist-equipment-summary?edit=&editorigin=${req.editOriginUrl}`);
         });
       } else {
         next();
       }
     },
    postvalidate: (req, res, next) => {
      const allData = req.casa.journeyContext.getDataForPage('__hidden_specialist_equipment_page__');
      if (allData === undefined) {
        res.locals.index = '0';
      } else if (req.query.changeClaim) {
        res.locals.index = parseInt(req.query.changeClaim)
      } else {
        const keysLength = Object.keys(allData).length;
        res.locals.index = parseInt(Object.keys(allData)[keysLength - 1], 10) + 1;
      }

      const data = req.casa.journeyContext.getDataForPage('your-specialist-equipment');
      const hiddenPage = req.casa.journeyContext.getDataForPage('__hidden_specialist_equipment_page__') ?? Object.create(null);

      hiddenPage[res.locals.index] = data.item;

      req.casa.journeyContext.setDataForPage('__hidden_specialist_equipment_page__', hiddenPage);

      if (!req.inEditMode) {
        req.casa.journeyContext.setDataForPage('specialist-equipment-summary', undefined);
      }
      JourneyContext.putContext(req.session, req.casa.journeyContext);

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        return next();
      });
    },
  },
});
