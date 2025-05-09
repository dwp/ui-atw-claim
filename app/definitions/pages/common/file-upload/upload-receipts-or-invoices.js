const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const FormData = require('form-data');
const axios = require('axios');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const fieldValidators = require('../../../field-validators/common/file-upload/upload-receipts-or-invoices');
const {
  fileSizeLimit,
} = require('../../../../config/config-mapping');
const logger = require('../../../../logger/logger');
const config = require('../../../../config/config-mapping');
const { claimTypesShortName } = require('../../../../config/claim-types');

const log = logger('common:file-upload.upload-receipts-or-invoices');

const {
  url,
} = config.evidenceHandler;

dayjs.extend(utc);

async function uploadFile(userId, file, name) {
  try {
    const formData = new FormData();
    formData.append('file', file, { filename: name });
    formData.append('userId', userId);

    const result = await axios({
      method: 'post',
      url: '/convert',
      baseURL: url,
      headers: formData.getHeaders(),
      data: formData,
    });

    log.debug(`Upload status: ${result.status}`);
    return result;
  } catch (e) {
    log.error(e.message);
    throw e;
  }
}

module.exports = () => ({
  view: 'pages/common/file-upload/upload-receipts-or-invoices.njk',
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {    
      res.locals.fileUpload = true;
      res.locals.BUTTON_TEXT = res.locals.t('upload-receipts-or-invoices:continueButton');
      res.locals.fileSizeLimit = fileSizeLimit;
      res.locals.awardType = claimTypesShortName[req.casa.journeyContext.getDataForPage('__journey_type__').journeyType];
      next();
    },
    prevalidate: (req, res, next) => {
      const error = req.body && req.body.error;
      const pageName = req.casa.journeyWaypointId;

      const pageData = {
        file: 'in res.file',
        isFileLimitExceeded: false,
        isInvalidMimeType: false,
      };
      if (error) {
        if (error.name === 'NoFileError') {
          pageData.file = null;
        } else if (error.name === 'MimetypeError') {
          pageData.isInvalidMimeType = true;
        } else if (error.name === 'FileLimitError') {
          pageData.isFileLimitExceeded = true;
        } else {
          throw Error('invalid error type');
        }
      }

      req.casa.journeyContext.setDataForPage(pageName, pageData);
      JourneyContext.putContext(req.session, req.casa.journeyContext);

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        return next();
      });
    },
    postvalidate: async (req, res, next) => {
      try {
        const pageName = req.casa.journeyWaypointId;
        const { file } = req;
        const userId = req.casa.journeyContext.getDataForPage('__guid__').guid;
        const result = await uploadFile(userId, file.data, file.name);
        if (result.status === 200) {
          const {
            uploadedFileKeys,
          } = result.data;
          const pageData = req.casa.journeyContext.getDataForPage('__hidden_uploaded_files__');
          const files = pageData?.files !== undefined ? pageData.files : [];
          files.push({
            fileId: uploadedFileKeys,
            fileName: file.name,
          });
          log.debug(files);
          req.casa.journeyContext.setDataForPage(pageName, undefined);
          req.casa.journeyContext.setDataForPage('__hidden_uploaded_files__', { files });
          delete res.file;

          // Clears the radio buttons on the add another page so it is not selected on return
          if (req.casa.journeyContext.getDataForPage('receipts-invoices-uploaded')?.uploadMore !== undefined) {
            req.casa.journeyContext.setDataForPage('receipts-invoices-uploaded', undefined);
          }
          JourneyContext.putContext(req.session, req.casa.journeyContext);

          req.session.save((err) => {
            if (err) {
              throw err;
            }
            return next();
          });
        } else {
          next();
        }
      } catch (e) {
        const resp = e.response;
        log.error(e.message);
        let message = res.locals.t('upload-receipts-or-invoices:uploadError.failed');
        if (resp?.status === 406) {
          if (resp.data?.message === 'PASSWORD PROTECTED') {
            log.debug('The file cannot be uploaded because it is password protected');
            message = res.locals.t('upload-receipts-or-invoices:uploadError.passwordProtected');
          } else if (resp.data?.message === 'VIRUS DETECTED') {
            log.debug('The file cannot be uploaded because it contains a virus');
            message = res.locals.t('upload-receipts-or-invoices:uploadError.virusDetected');
          }
        } else {
          log.error(`Could not upload file ${resp?.status} ${resp?.message}`);
        }
        const error = {
          files: [{
            field: 'file',
            fieldHref: '#f-file',
            focusSuffix: '',
            validator: 'required',
            inline: message,
            summary: message,
          }],
        };
        next(error);
      }
    },
    preredirect: (req, res, next) => {
      res.locals.fileUpload = false;
      next();
    },
  },
});
