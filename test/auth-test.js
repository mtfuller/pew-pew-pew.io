const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const UserManager = require('../auth');

chai.should();
chai.use(chaiAsPromised);

let userManager = new UserManager();

describe("UserManager", function () {
    it("should allow new users to be created with a unique id", function() {
        return userManager.createUser().should.eventually.match(/^[^/\n\r]+$/);
    });

    it("should verify a new user's token", function () {
        return userManager.createUser().then(token => {
            return userManager.verifyUser(token).should.eventually.be.fulfilled;
        })
    });

    it("should reject an invalid token", function () {
        return userManager.createUser().then(token => {
            let invalidToken = "INVALID-TOKEN";
            return userManager.verifyUser(invalidToken).should.eventually.be.rejected;
        })
    });
});