const FormData = require('form-data');
const axios = require('axios');
const logger = require('../../logger/logger');
const config = require('../../config/config-mapping');

const log = logger('lib:controllers.evidence-handler-controller');

const {
  url,
} = config.evidenceHandler;

async function deleteFile(fileId) {
  try {
    const formData = new FormData();

    formData.append('key', fileId);
    const result = await axios({
      method: 'post',
      url: '/delete',
      baseURL: url,
      headers: formData.getHeaders(),
      data: formData,
    });

    log.debug(`Delete status: ${result.status}`);
    return result;
  } catch (e) {
    log.error(e.message);
    throw e;
  }
}

module.exports = {
  deleteFile,
};
