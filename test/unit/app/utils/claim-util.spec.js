const {
  expect,
} = require('chai');
const claimUtil = require('../../../../app/utils/claim-util');
const Request = require('../../../helpers/fakeRequest');

const setupGetDataForPageFunction = (claimType) => (claimType === 'SW' ? () => ({
  day: [
    {
      dayOfSupport: '1',
      timeOfSupport: {
        hoursOfSupport: '1',
        minutesOfSupport: '20'
      },
    },
    {
      dayOfSupport: '2',
      timeOfSupport: {
        hoursOfSupport: '3',
        minutesOfSupport: '20'
      },
    },
    {
      dayOfSupport: '1',
      timeOfSupport: {
        hoursOfSupport: '4',
        minutesOfSupport: '5'
      },
    },
  ],
}) : () => ({
  day: [
    {
      dayOfTravel: '1',
      totalTravel: '1',
    },
    {
      dayOfTravel: '2',
      totalTravel: '1',
    },
    {
      dayOfTravel: '1',
      totalTravel: '5',
    },
  ],
}));

describe('Utils: claim-utility', () => {
  const setupAllData = () => ({
    0: {
      monthYear: {
        mm: '12',
        yyyy: '2020',
      },
      claim: [{
        dayOfTravel: '1',
        totalTravel: '01',
      }],
    },
    9: {
      monthYear: {
        mm: '1',
        yyyy: '2020',
      },
      claim: [{
        dayOfTravel: '02',
        totalTravel: '2',
      }],
    },
  });

  it('should export an object with two functions', () => {
    expect(claimUtil)
      .to
      .be
      .a('object');

    expect(claimUtil.sumUnNestedAttributeForClaim)
      .to
      .be
      .a('function');
    expect(claimUtil.findIndexOfGivenMonth)
      .to
      .be
      .a('function');
  });

  describe('sumAttributesForAllClaims', () => {
    it('formats numeric claim data', () => {
      const allData = setupAllData();
      claimUtil.sumUnNestedAttributeForClaim(allData, ['totalTravel', 'dayOfTravel'], 'totalTravel');
      const expected = {
        0: {
          monthYear: {
            mm: '12',
            yyyy: '2020',
          },
          claim: [{
            dayOfTravel: 1,
            totalTravel: 1,
          }],
        },
        9: {
          monthYear: {
            mm: '1',
            yyyy: '2020',
          },
          claim: [{
            dayOfTravel: 2,
            totalTravel: 2,
          }],
        },
      };

      expect(allData).to.deep.eql(expected);
    });

    it('returns sum of an attribute for all claims', () => {
      const allData = setupAllData();

      const expected = 3;
      const actual = claimUtil.sumUnNestedAttributeForClaim(allData, ['totalTravel'], 'totalTravel');

      expect(actual).to.be.equal(expected);
    });
  });

  describe('findIndexOfGivenMonth', () => {
    const setupUserInput = () => ({
      mm: '01',
      yyyy: '2020',
    });

    it('returns \'undefined\' if allData is undefined', () => {
      const actual = claimUtil.findIndexOfGivenMonth(undefined, setupUserInput());
      expect(actual).to.be.equal(undefined);
    });

    it('returns \'undefined\' if entry for the month entered by user does not exist yet', () => {
      const userInput = {
        mm: '02',
        yyyy: '2022',
      };
      const actual = claimUtil.findIndexOfGivenMonth(setupAllData(), userInput);
      expect(actual).to.be.equal(undefined);
    });

    it('returns the index of the first entry that already exists in allData', () => {
      const actual = claimUtil.findIndexOfGivenMonth(setupAllData(), setupUserInput());
      const expected = '9';

      expect(actual).to.be.equal(expected);
    });
  });

  describe('rollUpEnteredDaysForAClaim', () => {
    let req;

    beforeEach(() => {
      req = new Request();
      req.casa = {
        journeyContext: {
          getDataForPage: () => {},
        },
      };
    });

    it('should throw an error if called with an unsupported claim type', () => {
      expect(() => {
        claimUtil.rollUpEnteredDaysForAClaim(req, 'foo');
      })
        .to
        .throw('Unsupported claimType: foo. The types supported at the moment are: SW, TW');
    });

    describe('SW data entry', () => {
      it('should roll up data if there are multiple entries with the same day', () => {
        req.casa.journeyContext.getDataForPage = setupGetDataForPageFunction('SW');

        const rolledUpData = claimUtil.rollUpEnteredDaysForAClaim(req, 'SW');

        expect(rolledUpData).to.be.deep.equal({
          day: [
            {
              dayOfSupport: '1',
              timeOfSupport: {
                hoursOfSupport: 5,
                minutesOfSupport: 25
              },
            },
            {
              dayOfSupport: '2',
              timeOfSupport: {
                hoursOfSupport: 3,
                minutesOfSupport: 20
              },
            }
          ],
        });
      });
    });

    describe('TW data entry', () => {
      it('should roll up data if there are multiple entries with the same day', () => {
        req.casa.journeyContext.getDataForPage = setupGetDataForPageFunction('TW');

        const rolledUpData = claimUtil.rollUpEnteredDaysForAClaim(req, 'TW');

        expect(rolledUpData).to.be.deep.equal({
          day: [
            {
              dayOfTravel: '1',
              totalTravel: 6,
            },
            {
              dayOfTravel: '2',
              totalTravel: 1,
            }
          ],
        });
      });
    });
  });
});
