const fs = require('fs');
const tunnel = require('tunnel');
const axios = require('axios');
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');
const formatPostcode = require('../../../../utils/format-postcode');
const logger = require('../../../../logger/logger');
const config = require('../../../../config/config-mapping');
const { PERSONAL_INFORMATION_URL } = require('../../../../config/uri');
const { stashStateForPage } = require('../../../../utils/stash-util');
const removeAllSpaces = require('../../../../utils/remove-all-spaces');

const log = logger('common:address-lookup.enter-postcode');

const proxy = config.addressLookup.proxy === null ? null : new URL(config.addressLookup.proxy);
const proxytunnel = config.addressLookup.proxy === null ? null
  // eslint-disable-next-line new-cap
  : new tunnel.httpsOverHttp({
    ca: [fs.readFileSync('certs/ca.pem')],
    key: fs.readFileSync('certs/key.pem'),
    cert: fs.readFileSync('certs/cert.pem'),
    proxy: {
      host: proxy.hostname,
      port: proxy.port,
    },
  });

const removePrePopulatedData = (req) => {
  stashStateForPage(req, 'new-postcode');
  req.casa.journeyContext.setDataForPage('new-postcode', undefined);
};

// eslint-disable-next-line func-names
module.exports = (view, fieldValidators, postcodeWP, selectWP, manualWP, addPayeeName) => ({
  view,
  fieldValidators,
  hooks: {
    preredirect: (req, res, next) => {
      if (req.inEditMode) {
        log.debug('inEditMode preredirect');

        req.casa.journeyContext.setDataForPage(selectWP, undefined);
        req.casa.journeyContext.setDataForPage(manualWP, undefined);

        JourneyContext.putContext(req.session, req.casa.journeyContext);

        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect(`${selectWP}?edit=&editorigin=${req.editOriginUrl}`);
        });
      } else {
        log.debug('Not inEditMode preredirect');
        next();
      }
    },
    prerender: (req, res, next) => {
      if (req.inEditMode) {
        log.debug('inEditMode prerender ');
        const { postcode } = req.casa.journeyContext.getDataForPage(
          '__hidden_address__',
        ).addressDetails;
        req.casa.journeyContext.setDataForPage(postcodeWP, { postcode });
      }
      res.locals.BUTTON_TEXT = res.locals.t(`${postcodeWP}:findAddressButton`);
      if (addPayeeName) {
        res.locals.payeeName = req.casa.journeyContext.getDataForPage(
          'about-needs-to-be-paid',
        ).fullName;
      } else {
        removePrePopulatedData(req);
        res.locals.forceShowBackButton = true;
        res.locals.casa.journeyPreviousUrl = `${PERSONAL_INFORMATION_URL}/personal-information-change`;
      }
      JourneyContext.putContext(req.session, req.casa.journeyContext);

      req.session.save((err) => {
        if (err) {
          throw err;
        }
        next();
      });
    },
    pregather: (req, res, next) => {
      req.body.postcode = removeAllSpaces(req.body.postcode);
      next();
    },
    postvalidate: async (req, res, next) => {
      const data = req.casa.journeyContext.getDataForPage(req.casa.journeyWaypointId);
      const postcode = formatPostcode(data.postcode);
      log.debug(`Searching for ${postcode}`);

      try {
        const result = await axios({
          httpsAgent: proxytunnel,
          proxy: false,
          method: 'get',
          url: `/${config.addressLookup.contextPath}/api/v2/lookup/address?postcode=${postcode}&excludeBusiness=false`,
          baseURL: config.addressLookup.url,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (result.status === 200) {
          log.debug('location-service was 200');
          const addresses = result.data.data;
          if (addresses.length === 0) {
            log.debug('Successfully looked up addresses. Got 0 results going to next page');
            req.casa.journeyContext.setDataForPage(req.casa.journeyWaypointId, Object.assign(data, {
              lookup_attempted: true,
              addresses: [],
            }));
            req.session.save((err) => {
              if (err) {
                throw err;
              }
              log.debug('location-service 200 length === 0 next()');
              next();
            });
          } else {
            log.debug('location-service 200 length !== 0');
            // Extract only the parts of addresses we need to avoid storing large
            // volumes of data in session
            const filteredAddresses = addresses.reduce((acc, address) => {
              if (address.singleLine && address.singleLine !== '') {
                acc.push({
                  uprn: address.uprn,
                  postcode: address.postcode,
                  singleLine: address.singleLine,
                });
              }
              return acc;
            }, []);

            log.debug(`Successfully looked up addresses. 
              Got ${addresses.length} results 
              (${filteredAddresses.length} filtered)`);

            req.casa.journeyContext.setDataForPage(
              req.casa.journeyWaypointId,
              Object.assign(data, {
                lookup_attempted: true,
                addresses: filteredAddresses,
              }),
            );
            JourneyContext.putContext(req.session, req.casa.journeyContext);

            req.session.save((err) => {
              if (err) {
                throw err;
              }
              log.debug('location-service 200 length !== 0 next()');
              next();
            });
          }
        }
      } catch (e) {
        log.debug('location-service catch');
        log.error(e.message);
        const resp = e.response;
        if (resp?.status === 404) {
          // Go to next page but with no address found
          log.debug('No address found for this url got 404 from address service');
          req.casa.journeyContext.setDataForPage(req.casa.journeyWaypointId, Object.assign(data, {
            lookup_attempted: true,
            addresses: [],
          }));
          JourneyContext.putContext(req.session, req.casa.journeyContext);

          req.session.save((err) => {
            if (err) {
              throw err;
            }
            log.debug('location-service 404 next()');
            next();
          });
        } else {
          log.debug(`location-service not 404 status was ${resp?.status}`);

          const message = 'Error getting addresses – try again.';

          const error = {
            files: [
              {
                field: 'postcode',
                fieldHref: '#f-postcode',
                focusSuffix: '',
                validator: 'required',
                inline: message,
                summary: message,
              }],
          };
          log.debug(`location-service not 404 status was ${resp?.status} next()`);
          next(error);
        }
      }
    },
  },
});
