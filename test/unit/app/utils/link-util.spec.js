const linkUtil = require('../../../../app/utils/link-util');
const Request = require('../../../../test/helpers/fakeRequest');

let expect;
(async() => {
  expect = (await import ('chai')).expect;
})();

const {
  getChangeLinkCalculatorMonthChange,
  getBackLinkFromQueryParameter,
  getChangeLinkCalculatorItemChange,
  getRemoveLinkCalculator
} = linkUtil;

describe('Utils: link-util', () => {
  it('should export an object with two util functions', () => {
    expect(linkUtil)
      .to
      .be
      .a('object');
    expect(getChangeLinkCalculatorMonthChange)
      .to
      .be
      .a('function');

    expect(getBackLinkFromQueryParameter)
      .to
      .be
      .a('function');
  });

  it('should export an object with one util functions', () => {
    expect(linkUtil)
      .to
      .be
      .a('object');
    expect(getChangeLinkCalculatorItemChange)
      .to
      .be
      .a('function');

    expect(getRemoveLinkCalculator)
      .to
      .be
      .a('function');
  });

  describe('getChangeLinkCalculatorMonthYear', () => {
    it('should accept only SW and TW as its claimType argument', () => {
      expect(() => {
        getChangeLinkCalculatorMonthChange('AV')
      }).to.throw('Unsupported claimType: AV. The types supported at the moment are: SW, TW, TIW');
    });

    it('should construct an object with the same interface for all supported types', () => {
      const changeLinkCalculatorForSW = getChangeLinkCalculatorMonthChange('SW');
      const changeLinkCalculatorForTW = getChangeLinkCalculatorMonthChange('TW');

      expect(changeLinkCalculatorForSW.calculateChangeLinkUrl).to.be.a('function');
      expect(changeLinkCalculatorForTW.calculateChangeLinkUrl).to.be.a('function');
    });

    describe('calculateChangeLinkUrl', () => {
      describe('SW', () => {
        const changeLinkCalculator = getChangeLinkCalculatorMonthChange('SW');

        it('should calculate change link when not in edit mode', () => {
          const changeLink = changeLinkCalculator.calculateChangeLinkUrl('0', '0', false)
          expect(changeLink).to.be.equal('support-days?changeMonthYear=0#f-day%5B0%5D%5BdayOfSupport%5D')
        });

        it('should calculate change link when in edit mode', () => {
          const changeLink = changeLinkCalculator.calculateChangeLinkUrl('0', '0', true)
          expect(changeLink).to.be.equal('support-days?edit&editorigin=/claim/check-your-answers&changeMonthYear=0#f-day%5B0%5D%5BdayOfSupport%5D')
        });
      });

      describe('TW', () => {
        const changeLinkCalculator = getChangeLinkCalculatorMonthChange('TW');

        it('should calculate change link when not in edit mode', () => {
          const changeLink = changeLinkCalculator.calculateChangeLinkUrl('0', '0', false)
          expect(changeLink).to.be.equal('travel-days?changeMonthYear=0#f-day%5B0%5D%5BdayOfTravel%5D')
        });

        it('should calculate change link when in edit mode', () => {
          const changeLink = changeLinkCalculator.calculateChangeLinkUrl('0', '0', true)
          expect(changeLink).to.be.equal('travel-days?edit&editorigin=/claim/check-your-answers&changeMonthYear=0#f-day%5B0%5D%5BdayOfTravel%5D')
        });
      });
    });
  });

  describe('getChangeLinkCalculatorItemChange', () => {
    it('should accept only AV as its claimType argument', () => {
      expect(() => {
        getChangeLinkCalculatorItemChange('TIW')
      }).to.throw('Unsupported claimType: TIW. The types supported at the moment are: AV');
    });

    it('should construct an object with the same interface for all supported types', () => {
      const changeLinkCalculatorForAV = getChangeLinkCalculatorItemChange('AV');

      expect(changeLinkCalculatorForAV.calculateChangeLinkUrl).to.be.a('function');
    });

    describe('calculateChangeLinkUrl', () => {
      describe('AV', () => {
        const changeLinkCalculator = getChangeLinkCalculatorItemChange('AV');

        it('should calculate change link when not in edit mode', () => {
          const changeLink = changeLinkCalculator.calculateChangeLinkUrl('0', '0', false)
          expect(changeLink).to.be.equal('your-vehicle-adaptations?changeClaim=0#f-item%5B0%5D%5Bdescription%5D')
        });

        it('should calculate change link when in edit mode', () => {
          const changeLink = changeLinkCalculator.calculateChangeLinkUrl('0', '0', true)
          expect(changeLink).to.be.equal('your-vehicle-adaptations?edit&editorigin=/claim/check-your-answers&changeClaim=0#f-item%5B0%5D%5Bdescription%5D')
        });
      });
    });
  });

  describe('getRemoveLinkCalculator', () => {
    it('should accept only AV as its claimType argument', () => {
      expect(() => {
        getRemoveLinkCalculator('TIW')
      }).to.throw('Unsupported claimType: TIW. The types supported at the moment are: AV');
    });
    describe('calculateRemoveLink', () => {
      describe('AV', () => {
        const removeLinkCalcluator = getRemoveLinkCalculator('AV');

        it('should calculate change link when not in edit mode', () => {
          const changeLink = removeLinkCalcluator.calculateRemoveLinkUrl('0', '0', false)
          expect(changeLink).to.be.equal('remove-vehicle-adaptations?remove=0#f-item%5B0%5D%5Bdescription%5D')
        });

        it('should calculate change link when in edit mode', () => {
          const changeLink = removeLinkCalcluator.calculateRemoveLinkUrl('0', '0', true)
          expect(changeLink).to.be.equal('remove-vehicle-adaptations?edit&editorigin=/claim/check-your-answers&remove=0#f-item%5B0%5D%5Bdescription%5D')
        });
      });
    })
  })

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
