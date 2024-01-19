// eslint-disable-next-line func-names
module.exports = () => ({
    view: 'pages/vehicle-adaptations/grant-only-for-adaptation-to-vehicle-costs.njk',
    hooks: {
      prerender: (req, res, next) => {
        res.locals.hideBackButton = true;
        next();
      },
    },
  });
  