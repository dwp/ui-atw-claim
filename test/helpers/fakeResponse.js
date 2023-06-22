const Request = require('./fakeRequest');

module.exports = class Response {
  constructor(request) {
    this.req = request || new Request();
    this.body = '';
    this.statusCode = 200;
    this.headers = {};
    this.cookies = {};
    this.locals = {
      casa: {
        mountUrl: '/',
      },
      t: (s) => (s),
    };
  }

  cookie(cookieName, cookieValue) {
    this.cookies[cookieName] = cookieValue;
    return this;
  }

  get(name) {
    return this.headers[name];
  }

  set(name, value) {
    this.headers[name] = value;
    return this;
  }

  setHeader(name, value) {
    this.set(name, value);
    return this;
  }

  send(body) {
    this.body = body;
    return this;
  }

  removeHeader(name) {
    delete this.headers[name];
    return this;
  }

  redirect(url) {
    this.redirectedTo = url;
    return this;
  }

  render(view, data) {
    this.rendered = { view, data };
    return this;
  }

  status(statusCode) {
    this.statusCode = statusCode;
    return this;
  }
};
