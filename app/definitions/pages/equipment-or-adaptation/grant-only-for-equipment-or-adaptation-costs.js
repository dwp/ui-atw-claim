 
module.exports = () => ({
  view: 'pages/equipment-or-adaptation/grant-only-for-equipment-or-adaptation-costs.njk',
  hooks: {
    prerender: (req, res, next) => {
      next();
    },
  },
});
