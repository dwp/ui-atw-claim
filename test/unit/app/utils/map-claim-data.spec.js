const mapClaimData = require('../../../../app/utils/map-claim-data');
const { mappings } = require('../../../../app/definitions/pages/equipment-or-adaptation/_mappings');
const { mappings: twMappings } = require('../../../../app/definitions/pages/travel-to-work/_mappings');
const chai = require('chai');
const {
  assert,
} = chai;

describe('map-claim-data', () => {
  it('dont add to claim if showInJason == false', () => {
    const claim = {};
    const cleanedData = {
      'specialist-equipment-claim': {
        item: '123'
      }
    };

    mapClaimData(claim, 'specialist-equipment-claim', cleanedData, mappings);

    assert.deepEqual(claim, {});
  });

  it(' add to claim if showInJason == true', () => {
    const claim = {};
    const cleanedData = {
      item: [
        {
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '22',
            'mm': '11',
            'yyyy': '2020'
          }
        }
      ]

    };

    mapClaimData(claim, 'your-specialist-equipment', cleanedData, mappings);

    assert.deepEqual(claim, {
      'claim': [
        {
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '22',
            'mm': '11',
            'yyyy': '2020'
          }
        }
      ],
    });
  });

  it('add to claim and group values', () => {
    const claim = {};
    let cleanedData = {
      'fullName': 'George Herbert',
      'emailAddress': 'name@name.com'
    };

    mapClaimData(claim, 'person-company-being-paid-details', cleanedData, mappings);

    assert.deepEqual(claim, {
      'payee': {
        'details': {
          'fullName': 'George Herbert',
          'emailAddress': 'name@name.com'
        }
      }
    });

    cleanedData = {
      'accountHolderName': 'George Herbert',
      'sortCode': '000004',
      'accountNumber': '12345677',
      'rollNumber': '12345677'
    };

    mapClaimData(claim, 'person-company-being-paid-payment-details', cleanedData, mappings);

    assert.deepEqual(claim, {
      'payee': {
        'details': {
          'fullName': 'George Herbert',
          'emailAddress': 'name@name.com'
        },
        'bankDetails': {
          'accountHolderName': 'George Herbert',
          'sortCode': '000004',
          'accountNumber': '12345677',
          'rollNumber': '12345677'
        }
      }
    });

    cleanedData = {
      uprn: '12345',
      'addressDetails': {
        'address1': 'THE COTTAGE',
        'address2': 'ST. MARYS ISLAND',
        'address3': 'WHITLEY BAY',
        'address4': 'WHITLEY BAY',
        'postcode': 'NE26 4RS'
      },
    };

    mapClaimData(claim, '__hidden_address__', cleanedData, mappings);

    assert.deepEqual(claim, {
      'payee': {
        'details': {
          'fullName': 'George Herbert',
          'emailAddress': 'name@name.com'
        },
        'bankDetails': {
          'accountHolderName': 'George Herbert',
          'sortCode': '000004',
          'accountNumber': '12345677',
          'rollNumber': '12345677'
        },
        'address': {
          'address1': 'THE COTTAGE',
          'address2': 'ST. MARYS ISLAND',
          'address3': 'WHITLEY BAY',
          'address4': 'WHITLEY BAY',
          'postcode': 'NE26 4RS'
        },
      }
    });
  });

  it('handle addAllPageFieldsToGroup when TW and employed', () => {
    const claim = {};
    const workplaceContactDetails = {
      fullName: 'George Herbert',
      emailAddress: 'email@email.com',
    };

    mapClaimData(claim, 'confirmer-details', workplaceContactDetails, twMappings);

    const employmentStatus = {
      employmentStatus: 'employed'
    };

    mapClaimData(claim, 'employment-status', employmentStatus, twMappings);

    assert.deepEqual(claim, {
      workplaceContact: {
        employmentStatus: 'employed',
        fullName: 'George Herbert',
        emailAddress: 'email@email.com',
      }
    });
  });
  it('handle addAllPageFieldsToGroup when TW and selfEmployed', () => {
    const claim = {};

    mapClaimData(claim, 'confirmer-details', undefined, twMappings);

    const employmentStatus = {
      employmentStatus: 'selfEmployed'
    };

    mapClaimData(claim, 'employment-status', employmentStatus, twMappings);

    assert.deepEqual(claim, {
      workplaceContact: {
        employmentStatus: 'selfEmployed',
      }
    });
  });

  it('handle addAllPageFieldsToGroup when SW no employedStatus', () => {
    const claim = {};

    const workplaceContactDetails = {
      fullName: 'George Herbert',
      emailAddress: 'email@email.com',
    };

    mapClaimData(claim, 'confirmer-details', workplaceContactDetails, twMappings);

    assert.deepEqual(claim, {
      workplaceContact: {
        fullName: 'George Herbert',
        emailAddress: 'email@email.com',
      }
    });
  });

  it('do nothing if mapping config is showSingleField=false and not group', () => {
    const claim = {};
    let cleanedData = {
      'test': 'data',
    };

    mapClaimData(claim, 'test-waypoint', cleanedData, {
      'test-waypoint': {
        showInJson: true,
        outputFieldName: 'new-field',
        showSingleField: false
      }
    });

    assert.deepEqual(claim, { 'new-field': { test: 'data' } });
  });
});
