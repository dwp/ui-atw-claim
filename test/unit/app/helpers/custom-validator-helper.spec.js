
const getErorrMessageConstructor = require('../../../../app/helpers/custom-validator-helper');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai.use(require('sinon-chai'));
})();

describe('utils: custom-validator-helper', () => {
  it(`should export a function`, () => {
    assert.typeOf(getErorrMessageConstructor, 'function')
  });

  describe('getErrorMessageConstructor', () => {
    it('should return an object containing a function', () => {
      const errorMessageConstructor = getErorrMessageConstructor('nameOfFileContainingValidationDefinitions');

      assert.typeOf(errorMessageConstructor , 'object');
      assert.typeOf(errorMessageConstructor.constructErrorMessage, 'function');
    });

    describe('constructErrorMessage', () => {
      it(`should construct an error message that does not have Object's prototype`, () => {
        const errorMessageConstructor = getErorrMessageConstructor('nameOfFileContainingValidationDefinitions');
        
        const errorMessage = errorMessageConstructor.constructErrorMessage('foo', 0, 'bar');
        expect(errorMessage?.constructor?.prototype).not.equals(Object.prototype)
      });

      it('should construct an error message from the inputs', () => {
        const errorMessageConstructor = getErorrMessageConstructor('nameOfFileContainingValidationDefinitions');
        
        const errorMessage = errorMessageConstructor.constructErrorMessage('foo', 0, 'bar');

        expect(errorMessage).to.deep.equal({
          inline: 'nameOfFileContainingValidationDefinitions:validation.bar.foo.inline',
          summary: 'nameOfFileContainingValidationDefinitions:validation.bar.foo.summary',
          variables: {
            indexKey: 1
          },
          fieldKeySuffix: '[0][bar]'
        })
      });
    });
  });
});