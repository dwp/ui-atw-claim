const config = require('config');
const pkg = require('../../package.json');

const APP_VERSION = pkg.version;
const PORT = config.get('app.port');

const mountURL = config.get('app.mountUrl');

// Get redis config from environment
const USE_REDIS = config.has('session.redis.host') && config.get('session.redis.host') !== null
  && config.has('session.redis.port') && config.get('session.redis.port') !== null;
const REDIS_HOST = USE_REDIS ? config.get('session.redis.host') : null;
const REDIS_PORT = USE_REDIS ? config.get('session.redis.port') : null;
const REDIS_PASSWORD = USE_REDIS ? config.get('session.redis.password') : null;
const REDIS_DB = USE_REDIS ? config.get('session.redis.database') : null;
const REDIS_CLUSTER = USE_REDIS ? config.get('session.redis.cluster') : null;
const REDIS_USE_ENCRYPTION = USE_REDIS ? config.get('session.redis.useEncryption') : null;
const REDIS_KMS_ID = USE_REDIS ? config.get('session.redis.kmsId') : null;
const REDIS_AWS_REGION = USE_REDIS ? config.get('session.redis.awsRegion') : null;
const REDIS_PREFIX = USE_REDIS ? config.get('session.redis.prefix') : null;
const REDIS_USE_TLS = USE_REDIS ? config.get('session.redis.useTLS') : null;

// AWS cli looks for null here, so force it if it's undefined
const KMS_ENDPOINT_URL = config.has('session.redis.kmsEndpoint')
  ? config.get('session.redis.kmsEndpoint')
  : null;

const SESSION_SECURE_COOKIE = config.get('session.secure.cookie');
const SESSION_LENGTH = config.get('session.length');
const SESSION_NAME = config.get('session.name');

const SESSION_SECRET = config.get('session.secret');

const SHOW_WELSH_LANGUAGE_TOGGLE = config.get('languageToggle.showWelshLanguageToggle');

const enableNinoAllowList = config.get('allowList.allowListEnabled');

const megaByteLimit = config.get('services.evidenceHandler.megaByteLimit');
const fileSizeLimit = parseInt(megaByteLimit.toString(), 10) * 1000000;

const evidenceHandler = {
  url: config.get('services.evidenceHandler.url'),
};
const addressLookup = {
  url: config.get('services.addressLookup.url'),
  proxy: config.get('proxy.private.proxy'),
  contextPath: config.get('services.addressLookup.contextPath'),
};
const guidLookup = {
  url: config.get('services.guidLookup.url'),
  proxy: config.get('proxy.private.proxy'),
  proxyEnabled: config.get('services.guidLookup.enableProxy'),
  exchangeCredentials: config.get('services.guidLookup.exchange-credentials'),
};
const cognito = {
  url: config.get('services.cognito.url'),
  proxy: config.get('proxy.public.proxy'),
};
const bankValidation = {
  url: config.get('services.bankValidation.url'),
  consumerId: config.get('services.bankValidation.consumerId'),
  proxy: config.get('proxy.private.proxy'),
};
const claimSubmission = {
  url: config.get('services.claimSubmission.url'),
};
const discQuery = {
  url: config.get('services.discQuery.url'),
};

module.exports = {
  mountURL,
  APP_VERSION,
  PORT,
  USE_REDIS,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
  REDIS_DB,
  REDIS_CLUSTER,
  REDIS_USE_ENCRYPTION,
  REDIS_KMS_ID,
  REDIS_AWS_REGION,
  REDIS_PREFIX,
  REDIS_USE_TLS,
  KMS_ENDPOINT_URL,
  SESSION_SECURE_COOKIE,
  SESSION_LENGTH,
  SESSION_NAME,
  SESSION_SECRET,
  SHOW_WELSH_LANGUAGE_TOGGLE,
  enableNinoAllowList,
  fileSizeLimit,
  evidenceHandler,
  addressLookup,
  guidLookup,
  cognito,
  bankValidation,
  claimSubmission,
  discQuery,
};
