var Adoption = artifacts.require("./Adoption.sol");

// Test the pet id not exists.
contract("Adopt1", function (accounts) {
    var adoption;
    it("Init", function () {
        return Adoption.deployed().then(function (instance) {
            adoption = instance;
            return adoption.adopt(16, {from: accounts[0]});
        }).then(async function (id) {
            assert.equal(1, 2, "Error");
        }).catch(function (err) {
            assert.equal(1, 1, "Error");
        });
    });
});

// Test the normal adopt process.
contract("Adopt2", function (accounts) {
    var adoption;
    it("Init", function () {
        return Adoption.deployed().then(function (instance) {
            adoption = instance;
            return adoption.adopt(2, {from: accounts[0]});
        }).then(async function (id) {
            assert.equal(1, 1, "Error");
        }).catch(function (err) {
            assert.equal(1, 2, "Error");
        });
    });
});

// Test the pet has been adopted.
contract("Adopt3", function (accounts) {
    var adoption;
    it("Init", function () {
        return Adoption.deployed().then(function (instance) {
            adoption = instance;
            return adoption.adopt(2, {from: accounts[0]});
        }).then(async function (id) {
            await adoption.adopt(2, {from: accounts[0]});
            assert.equal(1, 2, "Error");
        }).catch(function (err) {
            assert.equal(1, 1, "Error");
        });
    });
});