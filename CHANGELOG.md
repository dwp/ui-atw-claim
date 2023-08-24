# Changelog

## 1.19.0 - (2023-08-23)
* Removed link from claim submission pages
* Updated project-metadata.yaml
* Fragment updates

## 1.18.0 - (2023-08-02)
* Declaration page updates
* Removed aria-required from some radio buttons for accessibility
* URL Changes for SW/TTW/SE journeys
* Changes to 'your claims' page
* Updated feedback links to go directly to form
* Removed section headers from all journeys
* Fragment updates

## 1.17.0 - (2023-07-11)
* Cookie Page Updates (English and Welsh translations)
* Change ninos to return GUID
* Fix to calls to ms-claim to stop front end issues when not 404 errors
* Change phase banner from 'Aplha' to 'Beta'
* Phase Banner Welsh translation
* sass and sinon package updates
* disable allow list for component tests
* Fixing issue with user data retained after claim completed

## 1.16.0 - (2023-06-20)
* Open source added to repo
* Accessibility statement page created and added
* Date filtering of select-support-to-claim and about-your-grant pages adjusted
* Updated hidden content on check-your-answers page
* Logging added to check the status of the allow list
* Changes to the content on confirm-workplace-contact page
* Updates to visually hidden content across all the summmary screens
* Correcting the page title for day-you-travelled-for-work, equipment-or-adaptation-cost and support-cost, screens.
* Dependency updates
* Fragment updates

## 1.15.0 - (2023-06-12)
* Update welsh translations
* Fix remove link for evidence summary page
* Use GUID when uploading file rather than random UUID
* (Dev only) Create a mapping of Nino to GUID to improve real world alignment
* Dependency updates


## 1.14.0 - (2023-06-06)
* Updates to the multiple-claims-journey-exit page to match the changes made to the respective non-multiple journey pages.
* Accessibility fixes and updates
* Improve logging on errors
* Correct issue with currencyFormatter
* Dependency updates

## 1.13.0 - (2023-05-30)

* Updated page titles across check you answers and cookies screens to improve accessibility
* Added more allow list capacity
* Content changes to about-your-grant pages, grant-only-for pages, and about-who-needs-to-be-paid pages
* Fix responsive deisgn issues
* Updated content for address and postcode input pages
* Assistive tools, mac voice control fixing
* Content changes for SE, SW and TTW screens
* Welsh toggle added to service, feature flag added and set to FALSE, content changes and updates to prepare service for welsh locales
* Move location and bank stub to atw stub image
* Update bank val from V2 to V3
* Added in must have accessability content changes acros multiple pages
* Dependency bumps
* Fragment updates
* Dockerfile updates

## 1.12.0 - (2023-04-11)

* SW journey design updated to inculde a minutes field when submitting time of support, now there is an hours and minutes field.
* Lingering hard coded language moved to json files.
* Accessibility bug fixes (h3 tag updated to legend tag, zoom usability updated for claims journey)
* Dependency bumps

## 1.11.0 - (2023-03-22)

* Removed notification badge from claims history pages
* Updating bank validation - remove non-numerical values before sending sort code to the validation endpoint
* Updating feedback page link
* Fixing link within contact us page for voice control detection
* Updating cost explanation content for SW journey
* Removing hint text from select-support-to-claim
* Dependency bumps
* Fragment updates

## 1.10.0 - (2023-03-06)

* TTW HTML Validation Fixes
* Accessibility Bug Fixes (<b> tag to <strong> tag, adding aria labels and describedby to buttons, update labels for upload buttons to match accessibility descriptions correctly)
* Updated some hint texts for SAE/SW/TTW routes
* Fixed safari link on Cookie Page
* NINO endDate update due to expired date
* Add/Change/Remove funcationality for pgone numbers on personal information page
* Remove aria label from cookie banner
* Removal of Employment Status being shown (self employed only)
* Changes to app.js for connect-redis update to 7.0.0
* Added Entry prefix to all fields that duplicate
* Tech docs fragment removed due to not being used

## 1.9.0 - (2023-01-30)

* HTML Validation fixes for SW and SAE journeys
* Added ms-claim-stub to component tests
* Validation for SAE, TTW and SW journeys updated. Naming convention of validations changed and new validators created
* validate-hour.js and date-filed-validation.json files added
* Move to SaaS runners
* Skip multi-claims-history page for multiple claims of same type fix
* Fix Accessibility Issue regarding invisible button on SAE your claim page
* Wiremock update
* Node update
* Dependency bumps
* Fragment updates

## 1.8.0 - (2022-12-14)

* Adding more capacity to private beta allow list
* Postcode lookup updated - Handle postcodes that are 1 letter 1 number and addresses with more than 4 lines
* Dependency bumps
* Pre-commit updated to remove axios from ignore as no longer causing issues

## 1.7.0 - (2022-12-6)

* Pre-commit addition due to axios 1.2.0 causing issues with component tests
* Fix made for claim-history, changed dateOfPayment to sentForPaymentOn when showing payments made
* Multiple previous awards shown for users when making a claim
* Fix issues with AWS certificates when using non root user
* Changes to valadation and error handling, address non-numeric characters being entered into date field and show users error
* Fragment updates
* Dependency bumps

## 1.6.0 - (2022-11-8)

* Bug fixes regarding users changing from miles to journeys and viec versa, at the check your answers page
* Bug fix for page not found when clicking back in a TTW or SW journey
* VRS link updated
* Made the context path for Address Lookup configurable
* Fragment updates
* Dependency bumps

## 1.5.0 - (2022-10-25)

* Error messages have been updated for several pages
* Google analytics tag added to headers
* Minor regex change for name field
* Dependency bumps

## 1.4.0 - (2022-10-11)

* Fix inaccessible assets in higher envs
* Switch over to Health Certificate Manager API for sourcing certificates
* Roll up entered data for a day
* Fix routing bugs
* Make about your grant page dynamic
* Changes to fields when editing them in PIC
* Fix to back button bug

## 1.2.0 - (2022-08-19)

* Correct mountUrl for Akamai
* Prevent users from entering days as numbers with decimal places
* Tidy up account middleware
* Fix back link in personal information change page

## 1.1.0 - (2022-08-01)

* Release

## 1.0.0 - (2022-07-18)

* Initial release
