const { JourneyContext } = require('@dwp/govuk-casa');

const noop = () => {};

module.exports = class Request {
  constructor(journeyContextData, journeyContextValidation = {}) {
    this.body = {};
    this.cookies = {};
    this.headers = {};
    this.params = {};
    this.query = {};
    this.userAuth = { id: '123', username: 'john_smith' };
    this.casa = {
      journeyContext: new JourneyContext(journeyContextData, journeyContextValidation),
      journeyWaypointId: '',
    };
    this.log = {
      info: noop,
      debug: noop,
      error: noop,
      trace: noop,
      warn: noop,
      fatal: noop,
    };
    this.sessionSaved = false;
    this.sessionDestroyed = false;
    this.session = {
      destroy: (cb) => {
        this.sessionDestroyed = true;
        return cb();
      },
      save: (cb) => {
        this.sessionSaved = true;
        return cb();
      },
    };
    this.i18nTranslator = {
      t: (key, value) => `${key}${value ? `:${value}` : ''}`,
      language: 'testLang',
    };
  }

  get(header) {
    return this.headers[header];
  }
};
