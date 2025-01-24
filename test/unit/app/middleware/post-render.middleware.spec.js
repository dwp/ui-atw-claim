const rewire = require('rewire');
const middleware = rewire('../../../../app/middleware/post-render.middleware');
const sinon = require('sinon');
const Request = require('../../../helpers/fakeRequest');
const Response = require('../../../helpers/fakeResponse');


let expect, assert;
(async () => {
    expect = (await import('chai')).expect;
    assert = (await import('chai')).assert;
    chai = await import('chai');
    chai.use(require('sinon-chai'));
})();

describe('Middleware: postrender', () => {
    let req, res, app;
    let nextStub = sinon.stub();

    const clearValidationErrorsForPage = middleware.__get__('clearValidationErrorsForPage');

    beforeEach(() => {
        req = new Request();
        res = new Response(req);
        nextStub = sinon.stub();

        req.casa = {
            journeyContext: {
                clearValidationErrorsForPage: sinon.stub(),
            }
        };
    });

    afterEach(() => {
        sinon.restore();
    })

    it('should clear validation errors for specified pages when URL matches', () => {
        req.originalUrl = '/claim/personal/change-personal-details';

        clearValidationErrorsForPage(req);

        const pagesToClear = [
            'remove-mobile-number',
            'remove-home-number',
            'new-phone-number',
            'new-mobile-number',
            'new-postcode',
            'enter-address',
            'new-address-select',
        ];


        pagesToClear.forEach(page => {
            expect(req.casa.journeyContext.clearValidationErrorsForPage).to.have.been.calledWith(page);
        });
    });

    it('should not clear validation errors when URL does not match', () => {
        req.originalUrl = '/non-matching-url';

        clearValidationErrorsForPage(req);

        const pagesToClear = [
            'remove-mobile-number',
            'remove-home-number',
            'new-phone-number',
            'new-mobile-number',
            'new-postcode',
            'enter-address',
            'new-address-select',
        ];


        pagesToClear.forEach(page => {
            expect(req.casa.journeyContext.clearValidationErrorsForPage).to.not.have.been.called;
        });
    });
});