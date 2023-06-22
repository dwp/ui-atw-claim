const busboy = require('busboy');
const NoFileError = require('./errors/no-file-error');
const FileLimitError = require('./errors/file-limit-error');

const logger = require('../logger/logger');
const config = require('../config/config-mapping');
const MimeTypeError = require('./errors/mime-type-error');

const log = logger('middleware:file-upload');

const supportedMimeTypes = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword'];
const megaByteLimit = config.fileSizeLimit;

function getFileFromMultipartFormData(req) {
  return new Promise((resolve, reject) => {
    req.body = {};
    const tempBuffers = [];
    const newFile = {
      name: '',
      size: 0,
      mimeType: '',
      data: new Uint8Array(),
    };
    const bb = busboy(
      {
        headers: req.headers,
        limits: { fileSize: megaByteLimit },
      },
    );
    bb.on('file', async (name, file, info) => {
      const {
        filename,
        mimeType,
      } = info;

      newFile.name = filename;
      newFile.mimeType = mimeType;
      req.file = newFile;

      if (filename === undefined) {
        log.debug('File upload middleware - no file found');
        file.resume()
          .on('end', () => {
            reject(new NoFileError('No file found'));
          });
      } else if (!supportedMimeTypes.includes(mimeType)) {
        log.debug('File upload middleware - mimeType is not allowed');
        file.resume()
          .on('end', () => {
            reject(new MimeTypeError('mimeType is not allowed'));
          });
      } else {
        file.on('data', (data) => {
          newFile.size += data.length;
          tempBuffers.push(data);
        });
        file.on('limit', () => {
          log.debug('File upload middleware - file limit reached');
          file.resume()
            .on('end', () => {
              reject(
                new FileLimitError(`file exceeds the allowed file size of ${megaByteLimit}MB`),
              );
            });
        });
        file.on('end', () => {
          newFile.data = Buffer.concat(tempBuffers, newFile.size);
        });
      }
    });
    bb.on('field', (fieldname, val) => {
      log.debug(`File field identified ${fieldname}`);
      req.body[fieldname] = val;
    });
    bb.on('finish', () => {
      log.debug('Finished');
      req.file = newFile;
      resolve();
    });
    req.pipe(bb);
  });
}

module.exports = async function DocumentUploadMiddleware(req, res, next) {
  if (req.method.toLowerCase() === 'post'
    && req.headers['content-type']
    && req.headers['content-type'].includes('multipart/form-data')) {
    try {
      log.debug('Starting conversion');

      await getFileFromMultipartFormData(req);
      log.debug('Converted');
    } catch (e) {
      log.debug(e.message);
      return next(e);
    }
  }
  return next();
};
