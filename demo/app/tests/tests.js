var Cifrate = require("nativescript-cifrate").Cifrate;
var cifrate = new Cifrate();

describe("greet function", function() {
    it("exists", function() {
        expect(cifrate.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(cifrate.greet()).toEqual("Hello, NS");
    });
});