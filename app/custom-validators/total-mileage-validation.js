 const ValidationError = require('@dwp/govuk-casa/lib/validation/ValidationError');
 const ValidatorFactory = require('@dwp/govuk-casa/lib/validation/ValidatorFactory');
 const regex = require('../config/regex-definitions');
 class TotalMileageObject extends ValidatorFactory {
   validate(value, dataContext = {}) {
     
     const baseErrorKey = 'total-mileage';
 
     const config = {
       errorMsg: {
         inline: `${baseErrorKey}:validation.invalid`,
         summary: `${baseErrorKey}:validation.invalid`,
       },
       ...this.config,
     };
 
     let valid = true;
     let { errorMsg } = config;
 
     if (value === undefined || value === '') {
        valid = false;

        errorMsg = {
          summary: `${baseErrorKey}:validation.required`,
          inline: `${baseErrorKey}:validation.required`,
        };
      }
      else {
        if (regex.NON_NUMERIC.test(value)) {
            valid = false;
    
            errorMsg = {
              summary: `${baseErrorKey}:validation.nonNumeric`,
              inline: `${baseErrorKey}:validation.nonNumeric`,
            };
          }
    
          if (regex.DECIMAL_REGEX.test(value)) {
            valid = false;
    
            errorMsg = {
              summary: `${baseErrorKey}:validation.nonDecimal`,
              inline: `${baseErrorKey}:validation.nonDecimal`,
            };
          }
      }
     
     return valid ? Promise.resolve() : Promise.reject(ValidationError.make({
       errorMsg,
       dataContext,
     }));
   }
 }
 
 module.exports = TotalMileageObject;
 