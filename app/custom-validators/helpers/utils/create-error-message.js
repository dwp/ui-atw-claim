function createErrorMessage(errorMessages, index, errorKey, focusSuffix) {
  const errorMessage = {
    inline: `${errorKey}.inline`,
    summary: `${errorKey}.summary`,
    variables: {
      indexKey: index + 1,
    },
    fieldKeySuffix: focusSuffix,
    focusSuffix: [focusSuffix],
  };

  errorMessages.push(errorMessage);
}

module.exports = createErrorMessage;
