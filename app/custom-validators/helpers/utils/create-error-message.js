function createErrorMessage(errorMessages, index, errorKey, fieldKeySuffix, focusSuffix) {
  const errorMessage = {
    inline: `${errorKey}.inline`,
    summary: `${errorKey}.summary`,
    variables: {
      indexKey: index + 1,
    },
    fieldKeySuffix,
    focusSuffix: [`[${focusSuffix}]`],
  };

  errorMessages.push(errorMessage);
}

module.exports = createErrorMessage;
