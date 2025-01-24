const clearValidationErrorsForPage = (req) => {

    // if the user recieves a validation error, the list of traversed routes are modified
    // as such, user is sent back to their last visited waypoint resulting in loop when clicking back button
    if(req.originalUrl == '/claim/personal/change-personal-details') {

      const pagesToClear = [
        'remove-mobile-number',
        'remove-home-number',
        'new-phone-number',
        'new-mobile-number',
        'new-postcode',
        'enter-address',
        'new-address-select',
      ]

      // traversed routes fixed once cleared
      pagesToClear.forEach(page => {
        req.casa.journeyContext.clearValidationErrorsForPage(page);
      });
    }
};

module.exports = (
  app,
) => {
  app.use(async (req, res, next) => {
    clearValidationErrorsForPage(req);

    next();
  });
};
