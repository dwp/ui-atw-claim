const crypto = require('crypto');

const cspHeaderName = 'Content-Security-Policy';

module.exports = (app, enableCsp) => {
  // Generate CSP nonce for inline Google Tag Manager script
  const generateCSP = (req, res, next) => {
    const nonce = crypto.randomBytes(16).toString('base64');
    const csp = res.get(cspHeaderName);
    res.setHeader(cspHeaderName, `${csp} 'nonce-${nonce}'`);
    res.locals.nonce = nonce;
    next();
  };

  // Disable CSP in dev/test environments so it does not block the dynamically
  // injected Google Tag Manager UI analysts use to configure it
  const removeCSP = (req, res, next) => {
    res.removeHeader(cspHeaderName);
    next();
  };

  app.use(enableCsp ? generateCSP : removeCSP);

  return { generateCSP, removeCSP };
};
