# Claim UI

## Summary

Application for the Access To Work Claim journey using the govuk-casa framework. This allows citizens to submit a claim
and upload evidence to allow agents approve their claims and ensure they get paid.

## Install

**NOTE:** You will need to configure npm on your development machine so that it uses
the [Health PDU Nexus npm registry](https://dwpdigital.atlassian.net/wiki/spaces/EN/pages/56725768926/Nexus#Nexus-npm).

```
npm install

```

Before running the application, please add a ```nino-to-guid-stub.js``` file to the /app/utils folder which contains
a guid for each nino in the ms-guid-stub. Below is an example of what would required in the ```nino-to-guid-stub.js```
file:
```
module.exports = function getGuidFromNino(nino) {
  switch (nino) {
    case 'AA370773A':
      return '221b5b9f-6ea1-6bc8-a44b-8271e2f852dd';
    default:
      return undefined;
  }
};
```

## Run

```
NODE_ENV=production DEBUG=ui-claim*,casa*,-*debug npm start
```

Debug
```
NODE_ENV=production DEBUG=ui-claim*,casa* npm start
```
## Test

```
npm run test:coverage
```

## Pre-commit Hooks

Install dependencies

```shell
npm install
```

Run once (when you clone the repo):

```shell
npm run prepare
```

Now when you commit the hooks in `.husky/pre-commit` will run


Maintainer Team: Bluejay

Contributing file: ../CONTRIBUTING.md