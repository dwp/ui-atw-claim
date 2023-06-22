const validators = require('../../../../app/custom-validators/equipment-or-adaptation-list-validation');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const {
  expect,
  assert
} = chai;

describe('Validators: equipmentOrAdaptationsListValidation', () => {

  it('I populate the description field blank and date and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '22',
            'mm': '11',
            'yyyy': '2020'
          }
        }]
      }.item))
      .to.be.fulfilled
    );
    return Promise.all(queue);
  });

  it('I enter the date 29/02/200 and can continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '29',
            'mm': '2',
            'yyyy': '2000'
          }
        }]
      }.item))
      .to
      .be
      .to.be.fulfilled);
    return Promise.all(queue);
  });

  it('I leave the description field blank and date field blank and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': '',
          'dateOfPurchase': {
            'dd': '',
            'mm': '',
            'yyyy': ''
          }
        },{
          'description': '',
          'dateOfPurchase': {
            'dd': '',
            'mm': '',
            'yyyy': ''
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 4);

          assert.equal(v[0].inline, 'your-equipment-or-adaptation:validation.description.required.inline');
          assert.equal(v[0].summary, 'your-equipment-or-adaptation:validation.description.required.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][description]');
          assert.equal(v[0].focusSuffix, '[[0][description]]');
          assert.equal(v[0].variables.indexKey, 1);

          assert.equal(v[2].inline, 'your-equipment-or-adaptation:validation.description.required.inline');
          assert.equal(v[2].summary, 'your-equipment-or-adaptation:validation.description.required.summary');
          assert.equal(v[2].fieldKeySuffix, '[1][description]');
          assert.equal(v[2].focusSuffix, '[[1][description]]');
          assert.equal(v[2].variables.indexKey, 2);

          const description = true;

          assert.equal(v[1].inline, 'date-field-validation:dateOfPurchaseValidation.required.inline');
          assert.equal(v[1].summary, 'date-field-validation:dateOfPurchaseValidation.required.summary');
        assert.equal(v[1].fieldKeySuffix, '[0][dateOfPurchase]');
        assert.equal(v[1].focusSuffix, '[[0][dateOfPurchase][dd]]');
          assert.equal(v[1].variables.indexKey, 1);

          assert.equal(v[3].inline, 'date-field-validation:dateOfPurchaseValidation.required.inline');
          assert.equal(v[3].summary, 'date-field-validation:dateOfPurchaseValidation.required.summary');
        assert.equal(v[3].fieldKeySuffix, '[1][dateOfPurchase]');
        assert.equal(v[3].focusSuffix, '[[1][dateOfPurchase][dd]]');
          assert.equal(v[3].variables.indexKey, 2);

          const dateOfPurchase = true;

          return dateOfPurchase && description;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description field blank and date field is populated (valid) and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': '',
          'dateOfPurchase': {
            'dd': '22',
            'mm': '11',
            'yyyy': '2020'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);
          assert.equal(v[0].inline, 'your-equipment-or-adaptation:validation.description.required.inline');
          assert.equal(v[0].summary, 'your-equipment-or-adaptation:validation.description.required.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][description]');
          assert.equal(v[0].focusSuffix, '[[0][description]]');
          assert.equal(v[0].variables.indexKey, 1);
          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description (valid) and only dd missing and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '',
            'mm': '11',
            'yyyy': '2020'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.missing.dd.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.missing.dd.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]');
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][dd]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description (valid) and only mm missing and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '1',
            'mm': '',
            'yyyy': '2020'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.missing.mm.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.missing.mm.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]');
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][mm]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description (valid) and only yyyy missing and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '1',
            'mm': '1',
            'yyyy': ''
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.missing.yyyy.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.missing.yyyy.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]');
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][yyyy]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description (valid) and only yyyy populated and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '',
            'mm': '',
            'yyyy': '2020'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.missing.dd.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.missing.dd.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]');
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][dd]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description (valid) and only mm populated and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '',
            'mm': '1',
            'yyyy': ''
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.missing.dd.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.missing.dd.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]');
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][dd]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description (valid) and only yyyy populated and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '',
            'mm': '',
            'yyyy': '2020'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.missing.dd.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.missing.dd.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]');
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][dd]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description (valid) and only dd populated and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '1',
            'mm': '',
            'yyyy': ''
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.missing.mm.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.missing.mm.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]');
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][mm]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description (valid) and date populated with day over 31 and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '32',
            'mm': '01',
            'yyyy': '2020'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.invalid.dd.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.invalid.dd.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]');
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][dd]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description (valid) and date populated with month over 12 and click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '31',
            'mm': '13',
            'yyyy': '2020'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.invalid.mm.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.invalid.mm.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]');
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][mm]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description (valid) and date populated but impossible date click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '31',
            'mm': '04',
            'yyyy': '2020'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.invalid.date.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.invalid.date.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]');
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][yyyy]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description (valid) and date populated but year is not in yyyy format', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '31',
            'mm': '04',
            'yyyy': '0999'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.invalid.date.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.invalid.date.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]');
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][yyyy]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description (valid) and date populated but year is negative', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '31',
            'mm': '04',
            'yyyy': '-1.2'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.invalid.date.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.invalid.date.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]');
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][yyyy]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description (valid) and date populated but in the future click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '30',
            'mm': '04',
            'yyyy': '2099'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.invalid.future.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.invalid.future.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]');
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][dd]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description (valid) and date populated but day is 0 click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '0',
            'mm': '04',
            'yyyy': '2099'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.invalid.date.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.invalid.date.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]');
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][yyyy]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I leave the description (valid) and date populated with letters click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': 'hi',
            'mm': 'to',
            'yyyy': 'item'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.nonNumeric.dd.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.nonNumeric.dd.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]')
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][dd]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter the date with non numeric value for month field click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '1',
            'mm': 'xyz',
            'yyyy': '2021'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.nonNumeric.mm.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.nonNumeric.mm.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]')
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][mm]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter the date with non numeric value for year field click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '1',
            'mm': '1',
            'yyyy': 'xyz'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.nonNumeric.yyyy.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.nonNumeric.yyyy.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]')
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][yyyy]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });

  it('I enter the date 29/02/2001 and get date invalid error when i click continue', async () => {
    const queue = [];
    queue.push(expect(validators.make()
      .validate({
        item: [{
          'description': 'Item 1',
          'dateOfPurchase': {
            'dd': '29',
            'mm': '2',
            'yyyy': '2001'
          }
        }]
      }.item))
      .to
      .be
      .rejected
      .eventually
      .satisfy((v) => {
          assert.equal(v.length, 1);

          assert.equal(v[0].inline, 'date-field-validation:dateOfPurchaseValidation.invalid.date.inline');
          assert.equal(v[0].summary, 'date-field-validation:dateOfPurchaseValidation.invalid.date.summary');
          assert.equal(v[0].fieldKeySuffix, '[0][dateOfPurchase]');
          assert.equal(v[0].focusSuffix, '[[0][dateOfPurchase][yyyy]]');
          assert.equal(v[0].variables.indexKey, 1);

          return true;
        }
      ));
    return Promise.all(queue);
  });
});



