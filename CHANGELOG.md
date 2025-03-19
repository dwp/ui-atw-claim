# Changelog

## 1.38.0 (2025-03-17)
* Multiple addresses correction in adress lookup
* TTW iterations - new claiming instructions page and CYA updates
* Deploy new beta survey link
* Navigation bug fix for personal details invalid entry
* Critical vulnerabilities fix
* Dependency updates

## 1.37.0 (2025-03-10)

* Update version ([c7b81317](https://gitlab.com/dwp/health/atw/components/ui-claim/-/commit/c7b81317))
* Update version and push jobs ([f91b447b](https://gitlab.com/dwp/health/atw/components/ui-claim/-/commit/f91b447b))
* Remove suppressions ([c9951ad0](https://gitlab.com/dwp/health/atw/components/ui-claim/-/commit/c9951ad0))
* Remove suppressions ([d7773ad1](https://gitlab.com/dwp/health/atw/components/ui-claim/-/commit/d7773ad1))
* 5867 - before You Continue ([aef22a7e](https://gitlab.com/dwp/health/atw/components/ui-claim/-/commit/aef22a7e))
* [skip-ci] ([6847bb6b](https://gitlab.com/dwp/health/atw/components/ui-claim/-/commit/6847bb6b))
* Merge develop into branch ([5d8f893e](https://gitlab.com/dwp/health/atw/components/ui-claim/-/commit/5d8f893e))
* Update curl version ([b8e6c089](https://gitlab.com/dwp/health/atw/components/ui-claim/-/commit/b8e6c089))
* Merge develop into branch ([26efaacb](https://gitlab.com/dwp/health/atw/components/ui-claim/-/commit/26efaacb))
* Disable component tests for now ([4e51455a](https://gitlab.com/dwp/health/atw/components/ui-claim/-/commit/4e51455a))
* Pull Integration CA from secrets manager ([43dc22b5](https://gitlab.com/dwp/health/atw/components/ui-claim/-/commit/43dc22b5))
* Pull Integration CA from secrets manager ([e03d8ab5](https://gitlab.com/dwp/health/atw/components/ui-claim/-/commit/e03d8ab5))
* Pull Integration CA from secrets manager ([4cc37016](https://gitlab.com/dwp/health/atw/components/ui-claim/-/commit/4cc37016))


## 1.36.0 - (2024-02-18)
* Fixed Git vulnerabilities
* Fixed Pipeline
* Bug fix to see multiple employer when user doesn't have multiple claim types

## 1.35.0 - (2024-02-05)
* Updated content on taxi costs page
* Updated styling on confirmer details page
* Updated design to journey summary pages
* Fixed incorrect content on details about cookies page
* Fixed styling on employment status page
* Added field checks to start of claim journey
* Fixed back routing on postcode finder
* Fixed date validation issue on invoice/date of support page
* Fixed incorrect Welsh routing from home to multiple claim
* Fixed error scenarios on journey/miles entry page
* Fixed content bug fixed on search addresses

## 1.34.0 - (2024-01-22)
* Fixed looping issue on back links inside personal information
* Fixed WCAG compliance issues (submitted screen and declaration pages)
* Fixed error scenario on Journeys/Miles Input page
* Fixed screen not found on employement status
* Content changes on Upload your receipts and invoices
* Removal of Nino allow list logic from environment code

## 1.33.0 - (2024-01-13)
* Logic to address instances of duplicate payee detail
* Summary card update for existing payee on Check Your Answers page 
* New bank details page

## 1.32.0 - (2025-01-08)
* About Your Grant and Grant Summary changes
* Content update on SE about your grant
* Content update for AtW/TiW on how to send invoice 
* Heading update on personal enter address screen
* Content update on your-work-travel-grant 
* TTW-Fixing loss of H1, P text and back button when editing Confirmer details
* Visually Hidden Text added for non-claim specific pages

## 1.31.0 - (2024-11-19)
* Fix for TiW and TTW journey entry pages to allow "0" as valid value

## 1.30.0 - (2024-11-13)
* Visually hidden text changes for various pages in TiW, SW, SAE, TTW and AtV journeys
* Updated error message for new payee name input
* Swapped H1 titles for the person or company we need to pay and details of the person or company we need to pay pages
* Updated code for the h1s in legends
* Content updates for the TTW cost contributions

## 1.29.0 - (2024-09-25)
* Fix data retention for journey details and journey number page
* DynaTrace added to repo
* Survey link updated
* AtV claim submission crashing service fixed, existing payee flag updated for AtV
* Added configurable variable for GA cookie removal
* Fix for missing label and no accessible name error for WCAG
* Fixing ARIA attribute is not allowed for SE, TTW and SW
* fix headers with no content for wcag compliance
* fix missing form label on new phone number page
* fix accessibility errors for support days page
* update days you had support to point at common file for week beginning content
* Push image to shared account
* Dependency updates
* Multiple awards changes
* SAE changes for WCAG Compliabnce
* Fix for bugs for TTW

## 1.28.0 - (2024-08-21)
* Remove language toggle for claim submitted page
* New information page for a user with no awards
* Major Chai dependency update to 5.1.1
* Node updated to 22.*.*
* Dependency updates

## 1.27.0 - (2024-07-03)
* Validation error focus fixed for fields of date input field for ATV and EA
* Remove user info when UI-claim calls disc-query
* Dependency updates

## 1.26.0 - (2024-06-04)
* Moved from SaaS to HCS runners
* Save and Print functionality fixed for claims history page
* 90 document evidence limit added for file upload
* Prod errors fixed
* Hidden text for TTW journey corrected
* Fix for TTW journey when switching from lift to taxi or vice versa
* Gov.uk link fixed
* Dependency updates

## 1.25.0 - (2024-4-17)
* New TIW journey added
* New TIW content added to various common pages across service
* New tests added to cover TIW journey
* Fix for ATV upload evidence issue
* Fragment updates
* Dependency updates

## 1.24.0 - (2024-3-6)
* Amending email regex to accept wider variety of emails
* Fixing SW journey bug whereby correct data wasn't retained upon changing an entry
* Dependency updates

## 1.23.0 - (2024-2-28)
* Hours and mintues field validation adjustment
* Check your answers page hours and minutes rounding bug fixed
* Crown logo updated to correct version
* Fragment updates
* Dependency updates

## 1.22.0 - (2024-2-12)
* EMAIL regex updates to fix validation issues
* New SW journey changes added
* 'Add another' SW page replaced by a checkbox list of dates
* All SW Summary tables updated with new summary card design
* SW journey now lead by support worker agency or name
* Choosing the days of supoport now leads onto a new hours of support page
* New SW data structure added to accomodate new journey style
* All support worker unit tests updated to reflect changes
* Fragment updates
* Dependency updates

## 1.21.0 - (2024-1-15)
* New journey, Adaptation to Vehicle
* New journey includes atv related new summary pages, new cya pages, new claim pages, new grant summary and claim history pages
* New unit tests added for ATV journey
* New summary card design implemented for Check your answers tables
* Remove inset text on cya screen
* Fragment updates
* Dependency updates

## 1.20.0 - (2023-11-09)
* New screens for multiple grants
* validation for counter signer email address
* Updated project-metadata.yaml
* Fragment updates
* Update pipeline to v3.1

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
