module.exports = () => ({
  view: 'pages/travel-to-work/grant-only-for-travel-to-work-costs.njk',
  hooks: {
    prerender: (req, res, next) => {
      next();
    },
  },
});
