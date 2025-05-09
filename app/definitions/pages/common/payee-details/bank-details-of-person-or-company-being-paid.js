const { trimWhitespace } = require('@dwp/govuk-casa').gatherModifiers;
const fs = require('fs');
const tunnel = require('tunnel');
const axios = require('axios');
const uuid = require('uuid');
const fieldValidators = require(
  '../../../field-validators/common/payee-details/bank-details-of-person-or-company-being-paid',
);
const logger = require('../../../../logger/logger');
const { MATCH_NON_DIGITS } = require('../../../../config/regex-definitions');
const {
  bankValidation,
} = require('../../../../config/config-mapping');
const { removeAllSpaces } = require('../../../../utils/remove-all-spaces');
const { claimTypesShortName } = require('../../../../config/claim-types');

const log = logger('common:payee-details.bank-details-of-person-or-company-being-paid');

const proxy = bankValidation.proxy === null ? null : new URL(bankValidation.proxy);
// eslint-disable-next-line new-cap
const proxytunnel = bankValidation.proxy === null ? null : new tunnel.httpsOverHttp({
  ca: [fs.readFileSync('certs/ca.pem')],
  key: fs.readFileSync('certs/key.pem'),
  cert: fs.readFileSync('certs/cert.pem'),
  proxy: {
    host: proxy.hostname,
    port: proxy.port,
  },
});

const page = 'person-company-being-paid-payment-details';
module.exports = () => ({
  view: 'pages/common/payee-details/bank-details-of-person-or-company-being-paid.njk',
  fieldGatherModifiers: {
    fullName: trimWhitespace,
  },
  fieldValidators,
  hooks: {
    prerender: (req, res, next) => {
      res.locals.payeeName = req.casa.journeyContext.getDataForPage(
        'person-company-being-paid-details',
      ).fullName;
      res.locals.awardType = claimTypesShortName[req.casa.journeyContext.getDataForPage('__journey_type__').journeyType];
      next();
    },
    pregather: (req, res, next) => {
      req.body.sortCode = removeAllSpaces(req.body.sortCode);
      req.body.accountNumber = removeAllSpaces(req.body.accountNumber);
      req.body.rollNumber = removeAllSpaces(req.body.rollNumber);
      next();
    },
    postvalidate: async (req, res, next) => {
      const data = req.casa.journeyContext.getDataForPage(page);

      const sortNumberWithoutNonNumericChars = data.sortCode.replace(MATCH_NON_DIGITS, '');
      try {
        const result = await axios({
          httpsAgent: proxytunnel,
          proxy: false,
          method: 'post',
          url: 'ame-payments/bank-validation/api/v3/validate',
          baseURL: bankValidation.url,
          headers: {
            'Content-Type': 'application/json',
            'X-Correlation-Id': uuid.v4(),
            'X-Consumer-Id': bankValidation.consumerId,
          },
          data: {
            sortCode: sortNumberWithoutNonNumericChars,
            accountNumber: data.accountNumber,
            rollNumber: data.rollNumber === undefined || data.rollNumber === ''
              ? null
              : data.rollNumber,
          },
        });

        if (result.status === 200) {
          const body = result.data;
          if (body.validDetails) {
            log.debug('Valid bank details');

            if (body.transactionsSupported.includes('DIRECT_CREDIT')) {
              log.debug('Account passed');
            } else {
              log.error('Does not support BACS (DIRECT_CREDIT)');
            }
            log.debug('Valid bank details next()');

            req.casa.journeyContext.setDataForPage('person-company-being-paid-payment-details', {
              accountHolderName: data.accountHolderName,
              sortCode: sortNumberWithoutNonNumericChars,
              accountNumber: data.accountNumber,
              rollNumber: data.rollNumber,
            });

            next();
          } else {
            log.debug('Invalid bank details');

            const errorMsg = res.locals.t('bank-details-of-person-or-company-being-paid:invalidBankDetails');
            log.debug('Invalid bank details next()');
            next({
              invalid: [
                {
                  inline: errorMsg,
                  summary: errorMsg,
                  focusSuffix: [],
                  field: '',
                  fieldHref: '#f-sortCode',
                }],
            });
          }
        } else {
          log.error(`Unexpected response code ${result.status}`);

          const message = res.locals.t('bank-details-of-person-or-company-being-paid:mismatchAccountDetails');

          const error = {
            invalid: [
              {
                inline: message,
                summary: message,
                focusSuffix: [],
                field: '',
                fieldHref: '#f-sortCode',
              }],
          };
          log.debug(`Unexpected response code ${result.status} next()`);
          next(error);
        }
      } catch (e) {
        const resp = e.response;
        if (resp?.status === 400) {
          log.error(`BadRequest in Bank Validation ${e.message}`);
        } else {
          log.error(`Failed to match bank account details ${e.message}`);
        }

        const message = res.locals.t('bank-details-of-person-or-company-being-paid:mismatchAccountDetails');

        const error = {
          invalid: [
            {
              inline: message,
              summary: message,
              focusSuffix: [],
              field: '',
              fieldHref: '#f-sortCode',
            }],
        };
        log.debug(
          'We could not match these details to an account. Make sure they are correct and try again',
        );
        next(error);
      }
    },
  },
});
