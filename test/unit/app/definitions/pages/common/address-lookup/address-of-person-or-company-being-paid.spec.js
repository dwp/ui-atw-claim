const page = require("../../../../../../../app/definitions/pages/common/address-lookup/select-address");
const sinon = require("sinon");
const Request = require("../../../../../../helpers/fakeRequest");
const Response = require("../../../../../../helpers/fakeResponse");
const JourneyContext = require('@dwp/govuk-casa/lib/JourneyContext');

let assert, expect;
(async() => {
  assert = (await import ('chai')).assert;
  expect = (await import ('chai')).expect;
  chai = await import ('chai');
chai.use(require('sinon-chai'));
})();

describe("definitions/pages/common/payee-details/address-of-person-or-company-being-paid", () => {
  it("should page a function", () => {
    assert.typeOf(page, "function");
  });
  describe("when exported function is invoked", () => {
    beforeEach(() => {
      this.result = page(
        'pages/common/payee-details/address-of-person-or-company-being-paid.njk',
        require('../../../../../../../app/definitions/field-validators/common/payee-details/address-of-person-or-company-being-paid'),
        'person-company-being-paid-postcode',
        'person-company-being-paid-address',
        'enter-person-company-being-paid-address',
        '__hidden_address__',
        true,
      );
    });
    it("when exported function is invoked", () => {
      assert.typeOf(this.result, "object");
    });

    describe("returned object keys", () => {
      describe("`view` key", () => {
        it("should be defined", () => {
          expect(Object.keys(this.result)).to.includes("view");
        });
        it("value be a string", () => {
          assert.typeOf(this.result.view, "string");
          assert.equal(
            this.result.view,
            "pages/common/payee-details/address-of-person-or-company-being-paid.njk"
          );
        });
      });
      describe("`fieldValidators` key", () => {
        it("should be defined", () => {
          expect(Object.keys(this.result)).to.includes("fieldValidators");
        });
      });

      describe("`prerender` key", () => {
        it("should load page with list of addresses", () => {
          expect(Object.keys(this.result)).to.includes("hooks");
          expect(Object.keys(this.result.hooks)).to.includes("prerender");

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();
          //const setDataForPageStub = sinon.stub();

          req.casa = {
            journeyContext: {
              //setDataForPage: setDataForPageStub,
              getDataForPage: (page) => {
                if (page === "person-company-being-paid-postcode") {
                  return {
                    postcode: "NE26 4RS",
                    addresses: [
                      {
                        postcode: "NE26 4RS",
                        uprn: "1234567",
                        singleLine: "10 downing street, London, NE26 4RS",
                      },
                    ],
                  };
                } else if (page === "person-company-being-paid-address") {
                  return {
                    uprn: "7654321",
                  };
                } else if (page === "person-company-being-paid-details") {
                  return {
                    fullName: "Ted Smith",
                  };
                }
              },
            },
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub).to.be.calledOnceWithExactly();

          expect(res.locals.addresses).to.deep.equal([
            {
              value: "select-address",
              text: "address-of-person-or-company-being-paid:addressFound:1",
            },
            {
              value: "1234567",
              text: "10 downing street, London",
              selected: false,
            },
          ]);

          expect(res.locals.changePostcodeUrl).to.deep.equal(
            "person-company-being-paid-postcode#f-postcode"
          );

          expect(res.locals.manualAddressUrl).to.deep.equal(
            "?skipto=enter-person-company-being-paid-address"
          );

          expect(res.locals.payeeName).to.deep.equal("Ted Smith");

          expect(res.locals.postcode).to.deep.equal("NE26 4RS");

          expect(res.locals.hideContinueButton).to.deep.equal(undefined);
        });

        it("should load page with list of addresses in edit mode", () => {
          expect(Object.keys(this.result)).to.includes("hooks");
          expect(Object.keys(this.result.hooks)).to.includes("prerender");

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          req.inEditMode = true;

          req.editOriginUrl = "test-origin";

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === "person-company-being-paid-postcode") {
                  return {
                    postcode: "NE26 4RS",
                    addresses: [
                      {
                        postcode: "NE26 4RS",
                        uprn: "1234567",
                        singleLine: "10 downing street, London, NE26 4RS",
                      },
                    ],
                  };
                } else if (page === "person-company-being-paid-address") {
                  return {
                    uprn: "7654321",
                  };
                } else if (page === "person-company-being-paid-details") {
                  return {
                    fullName: "Ted Smith",
                  };
                }
              },
            },
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub).to.be.calledOnceWithExactly();

          expect(res.locals.addresses).to.deep.equal([
            {
              value: "select-address",
              text: "address-of-person-or-company-being-paid:addressFound:1",
            },
            {
              value: "1234567",
              text: "10 downing street, London",
              selected: false,
            },
          ]);

          expect(res.locals.changePostcodeUrl).to.deep.equal(
            "person-company-being-paid-postcode?edit=&editorigin=test-origin#f-postcode"
          );

          expect(res.locals.manualAddressUrl).to.deep.equal(
            "?skipto=enter-person-company-being-paid-address&edit=&editorigin=test-origin"
          );

          expect(res.locals.payeeName).to.deep.equal("Ted Smith");

          expect(res.locals.postcode).to.deep.equal("NE26 4RS");

          expect(res.locals.hideContinueButton).to.deep.equal(undefined);
        });

        it("should load page with addresses undefined", () => {
          expect(Object.keys(this.result)).to.includes("hooks");
          expect(Object.keys(this.result.hooks)).to.includes("prerender");

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          req.casa = {
            journeyContext: {
              getDataForPage: (page) => {
                if (page === "person-company-being-paid-postcode") {
                  return {
                    postcode: "NE26 4RS",
                  };
                } else if (page === "person-company-being-paid-address") {
                  return {
                    uprn: "7654321",
                  };
                } else if (page === "person-company-being-paid-details") {
                  return {
                    fullName: "Ted Smith",
                  };
                }
              },
            },
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub).to.be.calledOnceWithExactly();

          expect(res.locals.addresses).to.deep.equal([
            {
              value: "select-address",
              text: "address-of-person-or-company-being-paid:addressFound",
            },
          ]);

          expect(res.locals.changePostcodeUrl).to.deep.equal(
            "person-company-being-paid-postcode#f-postcode"
          );

          expect(res.locals.manualAddressUrl).to.deep.equal(
            "?skipto=enter-person-company-being-paid-address"
          );

          expect(res.locals.payeeName).to.deep.equal("Ted Smith");

          expect(res.locals.postcode).to.deep.equal("NE26 4RS");

          expect(res.locals.hideContinueButton).to.deep.equal(true);
        });

        it("should load page with existing data", () => {
          expect(Object.keys(this.result)).to.includes("hooks");
          expect(Object.keys(this.result.hooks)).to.includes("prerender");

          const req = new Request();
          const res = new Response(req);
          const nextStub = sinon.stub();

          req.casa = {
            journeyWaypointId: "person-company-being-paid-address",
            journeyContext: {
              getDataForPage: (page) => {
                if (page === "person-company-being-paid-postcode") {
                  return {
                    postcode: "NE26 4RS",
                    addresses: [
                      {
                        postcode: "NE26 4RS",
                        uprn: "1234567",
                        singleLine: "10 downing street, London, NE26 4RS",
                      },
                      {
                        postcode: "NE26 4RS",
                        uprn: "12345678",
                        singleLine: "11 downing street, London, NE26 4RS",
                      },
                    ],
                  };
                } else if (page === "person-company-being-paid-address") {
                  return {
                    uprn: "1234567",
                  };
                } else if (page === "person-company-being-paid-details") {
                  return {
                    fullName: "Ted Smith",
                  };
                }
              },
            },
          };

          this.result.hooks.prerender(req, res, nextStub);

          expect(nextStub).to.be.calledOnceWithExactly();

          expect(res.locals.addresses).to.deep.equal([
            {
              value: "select-address",
              text: "address-of-person-or-company-being-paid:addressFound:2",
            },
            {
              value: "1234567",
              text: "10 downing street, London",
              selected: true,
            },
            {
              value: "12345678",
              text: "11 downing street, London",
              selected: false,
            },
          ]);

          expect(res.locals.changePostcodeUrl).to.deep.equal(
            "person-company-being-paid-postcode#f-postcode"
          );

          expect(res.locals.manualAddressUrl).to.deep.equal(
            "?skipto=enter-person-company-being-paid-address"
          );

          expect(res.locals.payeeName).to.deep.equal("Ted Smith");

          expect(res.locals.postcode).to.deep.equal("NE26 4RS");

          expect(res.locals.hideContinueButton).to.deep.equal(undefined);
        });
      });
    });

    describe("`postvalidate` key", () => {
      let sandbox;
      beforeEach(() => {
        sandbox = sinon.createSandbox();
        sandbox.stub(JourneyContext, 'putContext').callsFake();
      });

      afterEach(() => {
        sandbox.restore();
      });

      it("should be defined", () => {
        expect(Object.keys(this.result.hooks)).to.include("postvalidate");
      });

      it("key value should be a function", () => {
        assert.typeOf(this.result.hooks.postvalidate, "function");
      });


      it("should save to hidden address page", () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        const setDataForPageStub = sinon.stub();

        req.casa = {
          journeyContext: {
            setDataForPage: setDataForPageStub,
            getDataForPage: (page) => {
              if (page === "person-company-being-paid-postcode") {
                return {
                  postcode: "NE26 4RS",
                  addresses: [
                    {
                      postcode: "NE26 4RS",
                      uprn: "1234567",
                      singleLine: "10 downing street, London, NE26 4RS",
                    },
                  ],
                };
              } else if (page === "person-company-being-paid-address") {
                return {
                  uprn: "1234567",
                };
              }
            },
          },
        };

        req.session = {
          save: sinon.stub().callsFake((cb) => {
            if (cb) {
              cb();
            }
          }),
        };

        this.result.hooks.postvalidate(req, res, nextStub);

        expect(nextStub).to.be.calledOnceWithExactly();

        expect(setDataForPageStub).to.be.calledOnceWithExactly(
          "__hidden_address__",
          {
            singleLine: "10 downing street, London, NE26 4RS",
            addressDetails: {
              address1: "10 downing street",
              address2: "London",
              postcode: "NE26 4RS",
            },
            addressFrom: "select",
            uprn: "1234567",
          }
        );
      });

      it("should save to hidden address page with format AA9A 9AA", () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        const setDataForPageStub = sinon.stub();

        req.casa = {
          journeyContext: {
            setDataForPage: setDataForPageStub,
            getDataForPage: (page) => {
              if (page === "person-company-being-paid-postcode") {
                return {
                  postcode: "AA9A 9AA",
                  addresses: [
                    {
                      postcode: "AA9A 9AA",
                      uprn: "1234567",
                      singleLine: "10 downing street, London, AA9A 9AA",
                    },
                  ],
                };
              } else if (page === "person-company-being-paid-address") {
                return {
                  uprn: "1234567",
                };
              }
            },
          },
        };

        req.session = {
          save: sinon.stub().callsFake((cb) => {
            if (cb) {
              cb();
            }
          }),
        };

        this.result.hooks.postvalidate(req, res, nextStub);

        expect(nextStub).to.be.calledOnceWithExactly();

        expect(setDataForPageStub).to.be.calledOnceWithExactly(
          "__hidden_address__",
          {
            singleLine: "10 downing street, London, AA9A 9AA",
            addressDetails: {
              address1: "10 downing street",
              address2: "London",
              postcode: "AA9A 9AA",
            },
            addressFrom: "select",
            uprn: "1234567",
          }
        );
      });

      it("should save to hidden address page and handle short postcodes and addresses with more than 4 lines", () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        const setDataForPageStub = sinon.stub();

        req.casa = {
          journeyContext: {
            setDataForPage: setDataForPageStub,
            getDataForPage: (page) => {
              if (page === "person-company-being-paid-postcode") {
                return {
                  postcode: "E2 4RS",
                  addresses: [
                    {
                      postcode: "E2 4RS",
                      uprn: "1234567",
                      singleLine: "Flat 1, Block 2, Street Name, South Ealing, Ealing, London, E2 4RS",
                    },
                  ],
                };
              } else if (page === "person-company-being-paid-address") {
                return {
                  uprn: "1234567",
                };
              }
            },
          },
        };

        req.session = {
          save: sinon.stub().callsFake((cb) => {
            if (cb) {
              cb();
            }
          }),
        };

        this.result.hooks.postvalidate(req, res, nextStub);

        expect(nextStub).to.be.calledOnceWithExactly();

        expect(setDataForPageStub).to.be.calledOnceWithExactly(
          "__hidden_address__",
          {
            singleLine: "Flat 1, Block 2, Street Name, South Ealing, Ealing, London, E2 4RS",
            addressDetails: {
              address1: "Flat 1, Block 2, Street Name",
              address2: "South Ealing",
              address3: "Ealing",
              address4: "London",
              postcode: "E2 4RS",
            },
            addressFrom: "select",
            uprn: "1234567",
          }
        );
      });


      it("throw error when address undefined", () => {
        const req = new Request();
        const res = new Response(req);
        const nextStub = sinon.stub();
        const setDataForPageStub = sinon.stub();

        req.casa = {
          journeyContext: {
            setDataForPage: setDataForPageStub,
            getDataForPage: (page) => {
              if (page === "person-company-being-paid-postcode") {
                return {
                  postcode: "NE26 4RS",
                };
              } else if (page === "person-company-being-paid-address") {
                return {
                  uprn: "1234567",
                };
              }
            },
          },
        };

        // Throw needs a function to check rather than a function result
        const postValidate = () =>
          this.result.hooks.postvalidate(req, res, nextStub);

        expect(postValidate).to.throw();

        sinon.assert.notCalled(setDataForPageStub);
        sinon.assert.notCalled(nextStub);
      });
    });

    it("throw error when uprn undefined", () => {
      const req = new Request();
      const res = new Response(req);
      const nextStub = sinon.stub();
      const setDataForPageStub = sinon.stub();

      req.casa = {
        journeyContext: {
          setDataForPage: setDataForPageStub,
          getDataForPage: (page) => {
            if (page === "person-company-being-paid-postcode") {
              return {
                postcode: "NE26 4RS",
                addresses: [
                  {
                    postcode: "NE26 4RS",
                    uprn: "1234567",
                    singleLine: "10 downing street, London, NE26 4RS",
                  },
                ],
              };
            }
          },
        },
      };

      // Throw needs a function to check rather than a function result
      const postValidate = () =>
        this.result.hooks.postvalidate(req, res, nextStub);

      expect(postValidate).to.throw();

      sinon.assert.notCalled(setDataForPageStub);
      sinon.assert.notCalled(nextStub);
    });
  });
});
