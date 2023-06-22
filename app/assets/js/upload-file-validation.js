/* eslint-disable */
(function () {
  document.getElementById('continue-button').onclick = function (event) {
    const fileBox = document.getElementById('f-file');
    const fileSizeLimit = document.getElementById('data-file-size-limit').dataset;
    const filesTotal = fileBox.files && fileBox.files[0] && fileBox.files[0].size; // + Number(runningFileSizeTotal.runningFileSize);
    const fileSizeLimitInMB = fileSizeLimit.fileSizeLimit;
    const supportedMimeTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];

    if (filesTotal > fileSizeLimitInMB || !supportedMimeTypes.includes(fileBox.files[0].type)) {
      event.preventDefault();
      let errorMessage;
      let inlineMessage;
      if (filesTotal > fileSizeLimitInMB) {
        errorMessage = document.getElementById('data-error-size-summary').dataset;
        inlineMessage = document.getElementById('data-error-size-inline').dataset;
      } else if (fileBox.files[0] !== undefined && !supportedMimeTypes.includes(fileBox.files[0].type)) {
        errorMessage = document.getElementById('data-error-type-summary').dataset;
        inlineMessage = document.getElementById('data-error-type-inline').dataset;
      }
      this.value = '';

      const inlineHTML =
        '<div class="govuk-form-group govuk-form-group--error">\n' +
        '<label class="govuk-label" for="f-file">\n' +
        'Upload a file\n' +
        '</label>\n' +
        '<span id="f-file-error" class="govuk-error-message">\n' +
        '<span class="govuk-visually-hidden">Error:</span>' + inlineMessage.errorInline + '</span>\n' +
        '<input class="govuk-file-upload govuk-file-upload--error" id="f-file" name="file" type="file" aria-describedby="f-file-error">\n' +
        '</div>';

      const hrefError = '<a href="#f-file">' + inlineMessage.errorInline + '</a>';
      if (document.getElementsByClassName('govuk-error-summary')[0]) {
        document.getElementsByClassName('govuk-error-summary__list')[0]
          .getElementsByTagName('li')[0].innerHTML = hrefError;

        document.getElementsByClassName('govuk-form-group')[0].innerHTML = inlineHTML;
      } else {
        document.getElementById('upload-error').innerHTML =
          '<div class="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabindex="-1" data-module="govuk-error-summary">\n' +
          '  <h2 class="govuk-error-summary__title" id="error-summary-title">\n' +
          errorMessage.errorSummary +
          '  </h2>\n' +
          '  <div class="govuk-error-summary__body">\n' +
          '    <ul class="govuk-list govuk-error-summary__list">\n' +
          '      <li>\n' +
          hrefError +
          '      </li>\n' +
          '    </ul>\n' +
          '  </div>\n' +
          '</div>';
        document.getElementsByClassName('govuk-form-group')[0].innerHTML = inlineHTML;
      }
      return false;
    } else {
      const backButton = document.getElementsByClassName('govuk-back-link')[0];
      const filebox = document.getElementById('f-file');
      const button = document.getElementById('continue-button');
      setTimeout(function () {
        filebox.setAttribute('disabled', 'disabled');
        button.setAttribute('disabled', 'disabled');
        button.setAttribute('aria-disabled', 'true');
        button.setAttribute('class', 'govuk-button govuk-button--disabled');
        backButton.href = '';
        backButton.setAttribute('class', 'govuk-back-link govuk-back-link--disabled');
        button.textContent = 'Uploading...';
      }, 100);
      return true;
    }
  };
})();
