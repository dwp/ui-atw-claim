const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const { v4: uuidv4 } = require('uuid');
const fieldValidators = require(
  '../../../field-validators/common/file-upload/receipts-or-invoices-uploaded',
);
const logger = require('../../../../logger/logger');

const log = logger('common:file-upload.receipts-or-invoices-uploaded');

const fileRemoveLinksTag = 'file-remove-links';
module.exports = () => ({
  view: 'pages/common/file-upload/receipts-or-invoices-uploaded.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      JourneyContext.removeContextsByTag(req.session, fileRemoveLinksTag);

      req.casa.journeyContext.setDataForPage('receipts-or-invoices-uploaded', undefined);

      res.locals.files = req.casa.journeyContext.getDataForPage('__hidden_uploaded_files__')
        .files
        .map((file, index) => {
          const removeContext = JourneyContext.fromObject(req.casa.journeyContext.toObject());

          removeContext.identity.id = uuidv4();
          removeContext.identity.tags = [fileRemoveLinksTag];

          log.debug(`Adding context ${removeContext.identity.id} to session`);

          removeContext.data['receipts-or-invoices-uploaded'] = {
            fileId: file.fileId,
            fileIndex: index,
            removeMode: true,
          };

          removeContext.clearValidationErrorsForPage('receipts-or-invoices-uploaded');
          removeContext.clearValidationErrorsForPage('remove-receipt-or-invoice');
          removeContext.setDataForPage('remove-receipt-or-invoice', undefined);

          JourneyContext.putContext(req.session, removeContext);

          let removeLink = `remove-receipt-or-invoice?contextid=${removeContext.identity.id}`;

          if (req.inEditMode) {
            log.debug('Edit mode');
            removeLink += `&edit=&editorigin=${req.editOriginUrl}`;
          }

          return {
            ...file,
            removeLink,
          };
        });

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        return next();
      });
    },
  },
});
