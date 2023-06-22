const express = require('express');
const path = require('path');
const logger = require('../logger/logger');
const { PUBLIC_URL } = require('../config/uri');

const log = logger('app:utils.static-assets');

const registerStaticAssets = (app) => {
  app.use(`${PUBLIC_URL}/css`, express.static(path.resolve(__dirname, '../../static/css'), {
    etag: false,
  }));
  app.use(`${PUBLIC_URL}/js`, express.static(path.resolve(__dirname, '../../static/js'), {
    etag: false,
  }));
  app.use(`${PUBLIC_URL}/assets`, express.static(path.resolve(__dirname, '../../static/assets'), {
    etag: false,
  }));

  log.debug('Static assets added');
};

module.exports = {
  registerStaticAssets,
};
