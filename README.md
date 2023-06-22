# Claim UI

## Summary

Application for the Access To Work Claim journey using the govuk-casa framework. This allows citizens to submit a claim
and upload evidence to allow agents approve their claims and ensure they get paid.

## Install

**NOTE:** You will need to configure npm on your development machine so that it uses
the [Health PDU Nexus npm registry](https://dwpdigital.atlassian.net/wiki/spaces/EN/pages/56725768926/Nexus#Nexus-npm).

```
npm install
npm install --registry=https://nexus.mgmt.health-dev.dwpcloud.uk/repository/npm-internal/ --always-auth
```

When running the application, please ensure that there is a ```allowedNinos.txt``` file in the root of the repository with any nino's which are allowed.
When running the application, the environment variable for allow nino needs to be set to false. This environment variable can be set in defualt.json file.

Also, before running the application, please add a ```nino-to-guid-stub.js``` file to the /app/utils folder which contains
a guid for each nino in the ```allowedNinos.txt``` file. Below is an example of what would required in the ```nino-to-guid-stub.js```
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