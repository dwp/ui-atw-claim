const { configure } = require('@dwp/govuk-casa');
const express = require('express');
const expressSession = require('express-session');
const KmsKeyProvider = require('@dwp/dwp-cryptoservice/KmsKeyProvider');
const CryptoService = require('@dwp/dwp-cryptoservice');
const compression = require('compression');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./app/config/config-mapping');
const logger = require('./app/logger/logger');
const DocumentUploadMiddleware = require('./app/middleware/file-upload.middleware');
const nonceMiddleware = require('./app/middleware/nonce');
const formatCurrency = require('./app/lib/custom-filters/currency-formatter');
const formatMonthYearObject = require('./app/lib/custom-filters/month-year-formatter');
const formatMonth = require('./app/lib/custom-filters/month-formatter');
const formatLocalDateTime = require('./app/lib/custom-filters/localdatetime-formatter');
const accountMiddleware = require('./app/middleware/account.middleware');
const timeOutMiddleware = require('./app/middleware/time-out.middleware');
const journeyTypeMiddleware = require('./app/middleware/journey-type.middleware');
const postRenderMiddleware = require('./app/middleware/post-render.middleware');
const urlMiddleware = require('./app/middleware/url.middleware');
const cookieMiddleware = require('./app/middleware/cookie-message');
const cookieDetailsGet = require('./app/routes/cookies/cookie-details.get');
const cookiePolicyPost = require('./app/routes/cookies/cookie-policy.post');
const cookiePolicyGet = require('./app/routes/cookies/cookie-policy.get');
const cookieParser = require('cookie-parser');
const hideSignOutMiddleware = require('./app/middleware/hide-sign-out.middleware');
const languageToggleMiddleware = require('./app/middleware/language-toggle.middleware');
const { registerStaticAssets } = require('./app/lib/static-assets');

const log = logger('app');
const {
  DECLARATION_VERSION,
  NEW_PERSONAL_DECLARATION_VERSION,
  CONSENT_COOKIE_NAME,
} = require('./app/config/constants');

const { SESSION_SECRET } = config;

/**
 * Setup session storage.
 */
const RedisKmsStoreDecorator = require('./app/lib/redis-kms-store-decorator');

let sessionStore;

if (config.REDIS_PORT && config.REDIS_HOST) {
  log.info('Using redis session storage at %s:%s', config.REDIS_HOST, config.REDIS_PORT);
  log.info(
    'REDIS_CLUSTER = %s, REDIS_DB = %s, TLS = %s',
    config.REDIS_CLUSTER,
    config.REDIS_DB,
    config.REDIS_USE_TLS,
  );

  const {RedisStore} = require('connect-redis');
  const Redis = require('ioredis');
  let redisClient;

  let clusterOptions;

  // Check whether redis is using transit encryption and amend clusterOptions if so
  if (config.REDIS_USE_TLS) {
    log.info('Redis transit encryption enabled');
    clusterOptions = {
      dnsLookup: (address, callback) => callback(null, address),
      redisOptions: {
        db: config.REDIS_DB,
        tls: {},
      },
    };
  } else {
    log.info('Redis transit encryption disabled');

    clusterOptions = {
      redisOptions: { db: config.REDIS_DB },
    };
  }

  if (config.REDIS_CLUSTER) {
    log.info('Cluster mode enabled');
    redisClient = new Redis.Cluster(
      [
        {
          host: config.REDIS_HOST,
          port: config.REDIS_PORT,
        },
      ],
      clusterOptions,
    );
  } else {
    log.info('Cluster mode disabled');
    redisClient = new Redis({
      host: config.REDIS_HOST,
      port: config.REDIS_PORT,
      password: config.REDIS_PASSWORD,
      db: config.REDIS_DB,
    });
  }

  let retryCount = 0;
  const REDIS_MAX_RETRY = 20;
  redisClient.on('error', (e) => {
    log.error('Redis error: %s', e);
    log.error('Redis error; will retry connection', {
      retry_counter: retryCount,
      err_message: e.message,
      err_stack: e.stack,
    });
    retryCount++;
    if (retryCount > REDIS_MAX_RETRY) {
      log.error('Redis max retry count reached - could not recover from error; exiting');
      log.error(e.message);
      log.debug(e);
      process.exit(1);
    }
  });
  redisClient.on('ready', () => {
    log.info('Redis connection ready');
  });
  redisClient.on('reconnecting', () => {
    log.info('Redis reconnecting');
  });
  redisClient.on('end', () => {
    log.info('Redis connection ended');
  });
  redisClient.on('connect', () => {
    log.info('Redis connection established');
  });
  redisClient.on('warning', (e) => {
    log.warn('Redis warning: %s', e);
  });
  redisClient.on('close', () => {
    log.info('Redis connection closed');
  });

  if (config.REDIS_USE_ENCRYPTION) {
    log.info('Redis session storage using encryption');
    log.info(
      'REDIS_KMS_ID = %s, REDIS_AWS_REGION = %s',
      config.REDIS_KMS_ID,
      config.REDIS_AWS_REGION,
    );
    // Prepare the KMS crypto for encrypting session data
    const kmsKeyProvider = new KmsKeyProvider({
      cmkId: config.REDIS_KMS_ID,
      keySpec: 'AES_256',
      region: config.REDIS_AWS_REGION,
      endpointUrl: config.KMS_ENDPOINT_URL,
    });
    const cryptoService = new CryptoService(kmsKeyProvider);

    // Decorate the session store with KMS-enabled getters/setters
    RedisKmsStoreDecorator(RedisStore, cryptoService);
  }

  // Create session store
  log.info('REDIS_PREFIX = %s', config.REDIS_PREFIX);
  sessionStore = new RedisStore({
    client: redisClient,
    prefix: config.REDIS_PREFIX,
    ttl: config.SESSION_LENGTH,
  });
} else {
  log.info('Using file-based session storage');
  const FileStore = require('session-file-store')(expressSession);
  sessionStore = new FileStore({
    path: './sessions',
    encrypt: true,
    reapInterval: 300,
    secret: SESSION_SECRET,
    retries: 0,
  });
}

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

app.use(DocumentUploadMiddleware, (err, req, res, next) => {
  if (err) {
    req.body.error = err;
  }
  return next();
});

registerStaticAssets(app);

const casaApp = configure(app, {
  mountUrl: config.mountURL,
  views: {
    dirs: [
      path.resolve(__dirname, './app/views'),
      path.resolve(__dirname, 'node_modules/hmrc-frontend'),
      path.resolve(__dirname, 'node_modules/nhsuk-frontend/packages/components'),
      path.resolve(__dirname, 'node_modules/govuk-frontend-v5/dist'),
    ],
  },
  compiledAssetsDir: path.resolve(__dirname, './static/'),
  serviceName: 'common:serviceName',
  phase: 'beta',
  sessions: {
    name: config.SESSION_NAME,
    store: sessionStore,
    secret: SESSION_SECRET,
    ttl: config.SESSION_LENGTH,
    secure: config.SESSION_SECURE_COOKIE,
  },
  i18n: {
    dirs: [path.resolve(__dirname, './app/locales')],
    locales: config.SHOW_WELSH_LANGUAGE_TOGGLE ? ['en', 'cy'] : ['en'],
  },
  allowPageEdit: true,
  useStickyEdit: true,
});

if (config.SESSION_SECURE_COOKIE) {
  log.info('Enabling secure cookies (trust proxy)');
  app.set('trust proxy', 1);
}

app.get('nunjucksEnv')
  .addFilter('formatMonthYearObject', formatMonthYearObject)
  .addFilter('formatCurrency', formatCurrency)
  .addFilter('formatMonth', formatMonth)
  .addFilter('formatLocalDateTime', formatLocalDateTime);

nonceMiddleware(casaApp.router, true);

cookieMiddleware(
  casaApp.router,
  CONSENT_COOKIE_NAME,
  'cookie-policy',
  'cookie-consent',
  '.get-disability-work-support.service.gov.uk', // CONFIG.GOOGLE_TAG_MANAGER_DOMAIN,
  config.mountURL, // mountUrl,
  '/', // proxyMountUrl,
  config.SESSION_SECURE_COOKIE, // useTLS,
);

urlMiddleware(casaApp.router);

hideSignOutMiddleware(casaApp.router);

if (config.SHOW_WELSH_LANGUAGE_TOGGLE) {
  languageToggleMiddleware(casaApp.router);
}

accountMiddleware(casaApp.router);
timeOutMiddleware(casaApp.router);
journeyTypeMiddleware(casaApp.router);
postRenderMiddleware(casaApp.router);

// Custom, non-journey routes handlers.
// Add any routes that are not involved in the data-gathering journey
// (e.g. feedback page, welcome/'before you start' page, other info pages, etc)
// should be declared before you load the CASA page/journey definitions.
require('./app/routes/index')(casaApp);
require('./app/routes/ping')(casaApp.router);
const declaration = require('./app/routes/declaration');
const newPersonalDeclaration = require('./app/routes/account/personal/new-personal-declaration');
const amendDeclaration = require('./app/routes/amend-declaration');
const {
  PERSONAL_INFORMATION_CONTEXT_PATH,
} = require('./app/config/uri');

casaApp.router.get(
  '/declaration',
  casaApp.csrfMiddleware,
  (req, res) => declaration()
    .declarationGet(req, res, DECLARATION_VERSION),
);
casaApp.router.post(
  '/declaration',
  casaApp.csrfMiddleware,
  (req, res) => declaration()
    .declarationPost(req, res, DECLARATION_VERSION),
);

casaApp.router.get(
  '/amend-declaration',
  casaApp.csrfMiddleware,
  (req, res) => amendDeclaration()
    .declarationGet(req, res, DECLARATION_VERSION),
);
casaApp.router.post(
  '/amend-declaration',
  casaApp.csrfMiddleware,
  (req, res) => amendDeclaration()
    .declarationPut(req, res, DECLARATION_VERSION),
);

// Time out
require('./app/routes/time-out')(casaApp);

// Account not found
require('./app/routes/account-not-found')(casaApp);

require('./app/routes/sign-out')(casaApp);

require('./app/routes/claim-sent')(casaApp);
require('./app/routes/claim-amended')(casaApp);

// DTH
require('./app/routes/dth/identity-not-confirmed')(casaApp);

// Error
require('./app/routes/error/problem-with-service')(casaApp);

// Accessibility Statement
require('./app/routes/common/accessibility-statement')(casaApp);

// Unauthorised access private beta
require('./app/routes/unauthorised/cannot-use-service')(casaApp);

// Portal Screens
require('./app/routes/account/home')(casaApp);
require('./app/routes/account/contact-us')(casaApp);
require('./app/routes/account/about-your-grant')(casaApp);
require('./app/routes/account/multiple-job-select')(casaApp);
require('./app/routes/account/claim-by-post')(casaApp);
require('./app/routes/account/claims-history')(casaApp);
require('./app/routes/account/claims-timeline')(casaApp);
require('./app/routes/account/view-your-claim-submission')(casaApp);
require('./app/routes/account/about-your-current-claim')(casaApp);
require('./app/routes/account/personal/personal-information-submitted')(casaApp);
require('./app/routes/account/change-your-claim')(casaApp);
require('./app/routes/account/multiple-claims-exit')(casaApp);
require('./app/routes/account/no-awards')(casaApp);

casaApp.router.get(
  `${PERSONAL_INFORMATION_CONTEXT_PATH}/new-personal-declaration`,
  casaApp.csrfMiddleware,
  (req, res) => newPersonalDeclaration()
    .newPersonalDeclarationGet(req, res, NEW_PERSONAL_DECLARATION_VERSION),
);
casaApp.router.post(
  `${PERSONAL_INFORMATION_CONTEXT_PATH}/new-personal-declaration`,
  casaApp.csrfMiddleware,
  (req, res) => newPersonalDeclaration()
    .newPersonalDeclarationPost(req, res, NEW_PERSONAL_DECLARATION_VERSION),
);

// Cookie policy pages
casaApp.router.get('/cookie-details', casaApp.csrfMiddleware, cookieDetailsGet(
  CONSENT_COOKIE_NAME,
  config.SESSION_NAME,
  config.SESSION_LENGTH,
));
casaApp.router.get('/cookie-policy', casaApp.csrfMiddleware, cookiePolicyGet());

casaApp.router.post('/cookie-policy', casaApp.csrfMiddleware, cookiePolicyPost(
  CONSENT_COOKIE_NAME,
  config.mountURL, // casaApp.config.mountUrl,
  '.dwp.gov.uk', // CONFIG.GOOGLE_TAG_MANAGER_DOMAIN,
  config.SESSION_SECURE_COOKIE, // CONFIG.USE_TLS,
));

const pageDefinitions = require('./app/definitions/pages')();
const journeyDefinition = require('./app/definitions/journeys')();

// Load CASA page and user journey definitions
casaApp.loadDefinitions(
  pageDefinitions,
  journeyDefinition,
);

// Start server
const server = app.listen(config.PORT, () => {
  const host = server.address().address;
  const { port } = server.address();
  log.info('App listening at http://%s:%s', host, port);
});
