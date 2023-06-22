/* eslint-disable dot-notation */

const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require(
  '../../../field-validators/common/file-upload/remove-receipt-or-invoice',
);
const logger = require('../../../../logger/logger');
const { deleteFile } = require('../../../../lib/controllers/evidence-handler-controller');

const log = logger('common:file-upload.remove-receipt-or-invoice');

module.exports = () => ({
  view: 'pages/common/file-upload/remove-receipt-or-invoice.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.hideBackButton = true;

      const defaultContext = JourneyContext.getContextById(req.session, 'default');
      defaultContext.clearValidationErrorsForPage('receipts-or-invoices-uploaded');
      defaultContext
        .setDataForPage(
          'receipts-or-invoices-uploaded',
          { ...req.casa.journeyContext.getDataForPage('receipts-or-invoices-uploaded') },
        );

      JourneyContext.putContext(req.session, defaultContext);

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        next();
      });
    },
    preredirect: (req, res, next) => {
      const currentContext = req.casa.journeyContext;
      if (currentContext.getDataForPage('receipts-or-invoices-uploaded')?.removeMode === true) {
        const defaultContext = JourneyContext.getContextById(req.session, 'default');

        defaultContext.setDataForPage('receipts-or-invoices-uploaded', undefined);

        JourneyContext.putContext(req.session, defaultContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          next();
        });
      } else {
        next();
      }
    },
    postvalidate: async (req, res, next) => {
      const ephemeralData = req.casa.journeyContext.data;

      if (ephemeralData['remove-receipt-or-invoice'].removingEntry === 'yes') {
        const defaultContext = JourneyContext.fromObject(
          JourneyContext.getContextById(req.session, 'default')
            .toObject(),
        );
        const { fileIndex } = ephemeralData['receipts-or-invoices-uploaded'];
        const fileList = defaultContext.getDataForPage('__hidden_uploaded_files__').files;

        const { fileId } = fileList[fileIndex];
        log.debug(`File to delete ${fileId}, index ${fileIndex}`);
        const result = await deleteFile(fileId);
        if (result.status === 200) {
          log.debug('File deleted');
          fileList.splice(fileIndex, 1);
          defaultContext.setDataForPage('__hidden_uploaded_files__', { files: fileList });
          req.casa.journeyContext.setDataForPage('__hidden_uploaded_files__', { files: fileList });
          JourneyContext.putContext(req.session, defaultContext);
        } else {
          log.error(`File not deleted ${result.status}`);
        }
      } else {
        log.debug(
          `removingEntry is no ${ephemeralData['remove-receipt-or-invoice'].removingEntry}`,
        );
      }
      JourneyContext.removeContext(req.session, req.casa.journeyContext);

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        next();
      });
    },
  },
});
