module.exports = () => ({
  view: 'pages/travel-in-work/grant-only-for-travel-during-work-costs.njk',
  hooks: {
    prerender: (req, res, next) => {
      next();
    },
  },
});
