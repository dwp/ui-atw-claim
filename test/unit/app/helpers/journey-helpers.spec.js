const { JourneyContext } = require('@dwp/govuk-casa');
const journeyHelpers = require('../../../../app/helpers/journey-helpers');

let expect;
(async() => {
  expect = (await import ('chai')).expect;
})();

describe('Utils: journey-helpers', () => {
  describe('d', () => {
    it('should be a function', () => {
      expect(journeyHelpers.d)
        .to
        .instanceOf(Function);
    });

    it('should return data for a given waypoint', () => {
      const data = { data: 'test' };
      const context = new JourneyContext({ page: data });
      const pageData = journeyHelpers.d({}, context, 'page');
      expect(pageData)
        .to
        .deep
        .equal(data);
    });

    it('should return a null prototype object if the waypoint has no data', () => {
      const context = new JourneyContext({});
      const pageData = journeyHelpers.d({}, context, 'page');
      expect(pageData)
        .to
        .deep
        .equal(Object.create(null));
      expect(Object.getPrototypeOf(pageData))
        .to
        .equal(null);
    });

    it('should default waypoint to route source', () => {
      const data = { data: 'test' };
      const context = new JourneyContext({ page: data });
      const pageData = journeyHelpers.d({ source: 'page' }, context);
      expect(pageData)
        .to
        .deep
        .equal(data);
    });
  });

  describe('isEqualTo', () => {
    it('should be a function', () => {
      expect(journeyHelpers.isEqualTo)
        .to
        .instanceOf(Function);
    });

    it('should return a routing function', () => {
      expect(journeyHelpers.isEqualTo())
        .to
        .instanceOf(Function);
    });

    it('should return a function that returns true when a given field matches a value on a waypoint', () => {
      const context = new JourneyContext({ waypoint: { field: 'value' } });
      const test = journeyHelpers.isEqualTo('field', 'value', 'waypoint');
      expect(test({}, context))
        .to
        .deep
        .equal(true);
    });

    it('should return a function that returns false when a given field does not match a value on a waypoint', () => {
      const context = new JourneyContext({ waypoint: { field: 'value' } });
      const test = journeyHelpers.isEqualTo('field', 'wrong', 'waypoint');
      expect(test({}, context))
        .to
        .deep
        .equal(false);
    });

    it('should return a function that matches against source waypoint by default', () => {
      const context = new JourneyContext({ waypoint: { field: 'value' } });
      const test = journeyHelpers.isEqualTo('field', 'value');
      expect(test({ source: 'waypoint' }, context))
        .to
        .deep
        .equal(true);
    });
  });

  describe('wasSkipped', () => {
    it('should be a function', () => {
      expect(journeyHelpers.wasSkipped)
        .to
        .instanceOf(Function);
    });

    it('should return a routing function', () => {
      expect(journeyHelpers.wasSkipped())
        .to
        .instanceOf(Function);
    });

    it('should return a function that returns true when a given waypoint was skipped', () => {
      const context = new JourneyContext({ waypoint: { __skipped__: true } });
      const test = journeyHelpers.wasSkipped('waypoint');
      expect(test({}, context))
        .to
        .deep
        .equal(true);
    });

    it('should return a function that returns false when a given waypoint was not skipped', () => {
      const context = new JourneyContext({ waypoint: { field: 'yes' } });
      const test = journeyHelpers.wasSkipped('waypoint');
      expect(test({}, context))
        .to
        .deep
        .equal(false);
    });

    it('should return a function that matches against source waypoint by default', () => {
      const context = new JourneyContext({ waypoint: { __skipped__: true } });
      const test = journeyHelpers.wasSkipped();
      expect(test({ source: 'waypoint' }, context))
        .to
        .deep
        .equal(true);
    });
  });

  describe('isYes', () => {
    it('should be a function', () => {
      expect(journeyHelpers.isYes)
        .to
        .instanceOf(Function);
    });

    it('should return a routing function', () => {
      expect(journeyHelpers.isYes())
        .to
        .instanceOf(Function);
    });

    it('should return a function that returns true when a given field is "yes" on a waypoint', () => {
      const context = new JourneyContext({ waypoint: { field: 'yes' } });
      const test = journeyHelpers.isYes('field', 'waypoint');
      expect(test({}, context))
        .to
        .deep
        .equal(true);
    });

    it('should return a function that returns false when a given field is not "yes" on a waypoint', () => {
      const context = new JourneyContext({ waypoint: { field: 'no' } });
      const test = journeyHelpers.isYes('field', 'waypoint');
      expect(test({}, context))
        .to
        .deep
        .equal(false);
    });

    it('should return a function that matches against source waypoint by default', () => {
      const context = new JourneyContext({ waypoint: { field: 'yes' } });
      const test = journeyHelpers.isYes('field');
      expect(test({ source: 'waypoint' }, context))
        .to
        .deep
        .equal(true);
    });
  });

  describe('isNo', () => {
    it('should be a function', () => {
      expect(journeyHelpers.isNo)
        .to
        .instanceOf(Function);
    });

    it('should return a routing function', () => {
      expect(journeyHelpers.isNo())
        .to
        .instanceOf(Function);
    });

    it('should return a function that returns true when a given field is "no" on a waypoint', () => {
      const context = new JourneyContext({ waypoint: { field: 'no' } });
      const test = journeyHelpers.isNo('field', 'waypoint');
      expect(test({}, context))
        .to
        .deep
        .equal(true);
    });

    it('should return a function that returns false when a given field is not "no" on a waypoint', () => {
      const context = new JourneyContext({ waypoint: { field: 'yes' } });
      const test = journeyHelpers.isNo('field', 'waypoint');
      expect(test({}, context))
        .to
        .deep
        .equal(false);
    });

    it('should return a function that matches against source waypoint by default', () => {
      const context = new JourneyContext({ waypoint: { field: 'no' } });
      const test = journeyHelpers.isNo('field');
      expect(test({ source: 'waypoint' }, context))
        .to
        .deep
        .equal(true);
    });
  });

});
