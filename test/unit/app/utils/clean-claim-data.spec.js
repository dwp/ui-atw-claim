const cleanClaimData = require('../../../../app/utils/clean-claim-data');

let assert;
(async() => {
  assert = (await import ('chai')).assert;
})();

describe('JSON: clean-claim-data', () => {

  describe('JSON: cleanClaimData', () => {
    it('should export a function', () => {
      assert.typeOf(cleanClaimData, 'function');
    });
  });

  describe('JSON: clean page data', () => {

    it('should clean the page Data when provided with a objects', () => {
      const mapping = {
        page: {
          field: 'label',
          field2: 'label2',
          field3: undefined,
        },
      };
      const cleanedData = cleanClaimData(mapping);
      assert.deepEqual(cleanedData,
        {
          page:
            {
              field: 'label',
              field2: 'label2',
            }
        });
    });

    it('should clean the page Data when provided with a string', () => {
      const pageObject = {
        field: 'label',
      };
      const cleanedData = cleanClaimData(pageObject);
      assert.deepEqual(cleanedData, {
        field: 'label'
      });
    });

    it('should clean the page Data when provided with an empty string', () => {
      const pageObject = {
        field: '',
      };
      const cleanedData = cleanClaimData(pageObject);
      assert.deepEqual(cleanedData, {});
    });

    it('should clean the page Data no data for page', () => {
      const pageObject = {};

      const cleanedData = cleanClaimData(pageObject);
      assert.equal(cleanedData, undefined);
    });

    it('should clean the page Data is empty', () => {
      const pageObject = {
        page: {
          field: undefined,
        },
      };

      const cleanedData = cleanClaimData(pageObject);
      assert.deepEqual(cleanedData, {});

    });

    it('should throw error if type not supported', () => {
      const pageObject = { page: 1234 };
      const cleanedData = cleanClaimData(pageObject);
      assert.deepEqual(cleanedData, { page: 1234 });

    });
  });
});
