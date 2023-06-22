module.exports = (app) => {
  const populateResLocals = (req, res, next) => {
    res.locals.hideSignOut = true;
    next();
  };
  app.use('/public', populateResLocals);

  return { populateResLocals };
};
