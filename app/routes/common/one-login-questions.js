const {
    PUBLIC_CONTEXT_PATH,
  } = require('../../config/uri');
  
  module.exports = (casaApp) => {
    const oneLoginQA = (req, res) => {
      return res.render('pages/common/one-login-questions.njk');
    };
  
    casaApp.router.get(`${PUBLIC_CONTEXT_PATH}/one-login-questions`, casaApp.csrfMiddleware, oneLoginQA);
  
    return oneLoginQA;
  };
  