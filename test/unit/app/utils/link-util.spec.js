const {
  expect,
} = require('chai');
const linkUtil = require('../../../../app/utils/link-util');
const Request = require('../../../../test/helpers/fakeRequest');

const { getChangeLinkCalculator, getBackLinkFromQueryParameter } = linkUtil;
describe('Utils: link-util', () => {
  it('should export an object with two util functions', () => {
    expect(linkUtil)
      .to
      .be
      .a('object');
    expect(getChangeLinkCalculator)
      .to
      .be
      .a('function');
    
    expect(getBackLinkFromQueryParameter)
      .to
      .be
      .a('function');
  });

  describe('getChangeLinkCalculator', () => {
    it('should accept only SW and TW as its claimType argument', () => {
      expect(() => {
        getChangeLinkCalculator('TIW')
      }).to.throw('Unsupported claimType: TIW. The types supported at the moment are: SW, TW');
    });

    it('should construct an object with the same interface for all supported types', () => {
      const changeLinkCalculatorForSW = getChangeLinkCalculator('SW');
      const changeLinkCalculatorForTW = getChangeLinkCalculator('TW');

      expect(changeLinkCalculatorForSW.calculateChangeLinkUrl).to.be.a('function');
      expect(changeLinkCalculatorForTW.calculateChangeLinkUrl).to.be.a('function');
    });

    describe('calculateChangeLinkUrl', () => {
      describe('SW', () => {
        const changeLinkCalculator = getChangeLinkCalculator('SW');

        it('should calculate change link when not in edit mode', () => {
          const changeLink = changeLinkCalculator.calculateChangeLinkUrl('0', '0', false) 
          expect(changeLink).to.be.equal('days-you-had-support?changeMonthYear=0#f-day%5B0%5D%5BdayOfSupport%5D')
        });

        it('should calculate change link when in edit mode', () => {
          const changeLink = changeLinkCalculator.calculateChangeLinkUrl('0', '0', true) 
          expect(changeLink).to.be.equal('days-you-had-support?edit&editorigin=/claim/check-your-answers&changeMonthYear=0#f-day%5B0%5D%5BdayOfSupport%5D')
        });
      });

      describe('TW', () => {
        const changeLinkCalculator = getChangeLinkCalculator('TW');

        it('should calculate change link when not in edit mode', () => {
          const changeLink = changeLinkCalculator.calculateChangeLinkUrl('0', '0', false) 
          expect(changeLink).to.be.equal('days-you-travelled-for-work?changeMonthYear=0#f-day%5B0%5D%5BdayOfTravel%5D')
        });

        it('should calculate change link when in edit mode', () => {
          const changeLink = changeLinkCalculator.calculateChangeLinkUrl('0', '0', true) 
          expect(changeLink).to.be.equal('days-you-travelled-for-work?edit&editorigin=/claim/check-your-answers&changeMonthYear=0#f-day%5B0%5D%5BdayOfTravel%5D')
        });
      });
    });
  });

  describe('getBackLinkFromQueryParameter', () => {
    let req;

    beforeEach(() => {
      req = new Request();
    });

    it('should remove consecutive slashes from the URL', () => {
      req.query.referrer = '////claim////start';
      expect(getBackLinkFromQueryParameter(req)).to.equal('/claim/start');
    });

    it('should remove . and : from the URL', () => {
      req.query.referrer = '/:start.';
      expect(getBackLinkFromQueryParameter(req)).to.equal('/start');
    });
  });
});
