const tunnel = require('tunnel');
const fs = require('fs');
const {
  guidLookup,
  cognito,
} = require('../config/config-mapping');

const getPrivateProxyTunnel = () => {
  const privateProxy = guidLookup.proxyEnabled
    ? new URL(guidLookup.proxy) : null;

  return guidLookup.proxyEnabled
    ? tunnel.httpsOverHttp({
      ca: [fs.readFileSync('certs/ca.pem')],
      key: fs.readFileSync('certs/key.pem'),
      cert: fs.readFileSync('certs/cert.pem'),
      proxy: {
        host: privateProxy.hostname,
        port: privateProxy.port,
      },
    }) : null;
};

const getPublicProxyTunnel = () => {
  const publicProxy = cognito.proxy === null
    ? null
    : new URL(cognito.proxy);

  return cognito.proxy === null
    ? null
    : tunnel.httpsOverHttp({
      proxy: {
        host: publicProxy.hostname,
        port: publicProxy.port,
      },
    });
};

module.exports = {
  getPrivateProxyTunnel,
  getPublicProxyTunnel,
};
