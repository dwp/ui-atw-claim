const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../field-validators/equipment-or-adaptation/your-equipment-or-adaptation');
const logger = require('../../../logger/logger');
const removeAllSpaces = require('../../../utils/remove-all-spaces');

const log = logger('equipment-or-adaptations:your-equipment-or-adaptation');

// eslint-disable-next-line func-names
module.exports = () => ({
  view: 'pages/equipment-or-adaptation/your-equipment-or-adaptation.njk',
  fieldValidators,
  reviewBlockView: 'pages/equipment-or-adaptation/review/equipment.njk',
  hooks: {
    prerender: (req, res, next) => {
      const pageData = req.casa.journeyContext.getDataForPage('your-specialist-equipment');

      if (pageData === undefined) {
        log.debug('Initial population');

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

      next();
    },
    pregather: (req, res, next) => {
      Object.keys(req.body.item)
        .forEach((key) => {
          const index = parseInt(key, 10);
          const item = req.body.item[index];

          item.dateOfPurchase.dd = removeAllSpaces(item.dateOfPurchase.dd);
          item.dateOfPurchase.mm = removeAllSpaces(item.dateOfPurchase.mm);
          item.dateOfPurchase.yyyy = removeAllSpaces(item.dateOfPurchase.yyyy);
        });
      next();
    },
    prevalidate: (req, res, next) => {
      let editUrl = '';
      if (req.inEditMode) {
        editUrl = `?edit=&editorigin=${req.editOriginUrl}`;
      }

      if (req.body.remove !== undefined) {
        const pageData = req.casa.journeyContext.getDataForPage('your-specialist-equipment');

        pageData.item.splice(req.body.remove, 1);

        req.casa.journeyContext.setDataForPage('your-specialist-equipment', pageData);
        const goToItemIndex = req.body.remove !== '0' ? req.body.remove - 1 : 0;
        JourneyContext.putContext(req.session, req.casa.journeyContext);
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect(`your-specialist-equipment${editUrl}#f-item[${goToItemIndex}][description]`);
        });
      } else if (req.body.add !== undefined) {
        const pageData = req.casa.journeyContext.getDataForPage('your-specialist-equipment');
        pageData.item = [...pageData.item, {
          description: '',
          dateOfPurchase: {
            day: '',
            month: '',
            year: '',
          },
        }];

        req.casa.journeyContext.setDataForPage('your-specialist-equipment', pageData);
        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          return res.redirect(`your-specialist-equipment${editUrl}#f-item[${pageData.item.length - 1}][description]`);
        });
      } else {
        log.debug('Submit action');
        next();
      }
    },
  },
});
