module.exports = () => ({
  view: 'pages/support-worker/grant-only-for-support-worker-costs.njk',
  hooks: {
    prerender: (req, res, next) => {
      next();
    },
  },
});
