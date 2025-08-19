 
/**
 * Cleans the data in the page object, removes any items with empty string
 * or empty object values.
 *
 * @param {object} pageObject - The collected page data.
 * @returns {object} - Updated pageObject.
 */
function cleanData(pageObject) {
  if (Object.keys(pageObject).length !== 0) {
    Object.keys(pageObject)
      .forEach((item) => {
        if (typeof pageObject[item] === 'object') {
          Object.keys(pageObject[item])
            .forEach((objectItem) => {
              if (!pageObject[item][objectItem]) {
                delete pageObject[item][objectItem];
              }
              if (Object.getOwnPropertyNames(pageObject[item]).length === 0) {
                delete pageObject[item];
              }
            });
        } else if (typeof pageObject[item] === 'string') {
          if (!pageObject[item]) {
            delete pageObject[item];
          }
        }
      });
    return pageObject;
  }

  return undefined;
}

module.exports = (pageObject) => cleanData(pageObject);
