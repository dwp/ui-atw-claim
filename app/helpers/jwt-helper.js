const jwtDecode = require('jwt-decode');
const logger = require('../logger/logger');

const log = logger('utils:jwt-helper');

async function getGuidFromJwt(req) {
  const token = process.env.NODE_ENV === 'production'
    ? req.header('x-id-token')
    : req.session?.token;

  if (token === undefined) {
    log.debug('token undefined');
    return undefined;
  }

  try {
    const decoded = await jwtDecode(token);
    const { guid } = decoded;
    return guid;
  } catch (e) {
    throw new Error(`Failed to decode jwt "${token}", error: ${JSON.stringify(e)}`);
  }
}

module.exports = getGuidFromJwt;
