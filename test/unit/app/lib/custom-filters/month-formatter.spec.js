const formatter = require('../../../../../app/lib/custom-filters/month-formatter');
const {
  assert,
  expect,
} = require('chai');
const sinon = require('sinon');

describe('monthObjectFormatter', () => {
  
  const t = sinon.stub()

  it('format object with mm and yyyy - en', () => {
    const date = formatter({
      mm: '12',
      yyyy: '2020'
    }, t, {locale: 'en'});
    
    expect(t)
      .to
      .be
      .calledOnceWithExactly('common:months.12')

  });

  it('invalid month', () => {
    const date = formatter({
      mm: '13',
      yyyy: '2020'
    }, t);

    expect(t)
      .to
      .not
      .be
      .calledOnceWithExactly('common:months.13');

  });

  it('missing month', () => {
    const date = formatter({
      yyyy: '2020'
    }, t);

    assert.equal(date, 'INVALID DATE OBJECT');
  });
  it('missing month', () => {
    const date = formatter({
      mm: '12'
    }, t);

    assert.equal(date, 'INVALID DATE OBJECT');
  });

  it('pass in non object value', () => {
    const date = formatter('12', t);

    assert.equal(date, 'INVALID DATE OBJECT');
  });

});
