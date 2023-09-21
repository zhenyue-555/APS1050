var Adoption = artifacts.require("./Adoption.sol");

//Test register pet.
contract("Register", function (accounts) {
    var adoption;
    it("Init", function () {
        return Adoption.deployed().then(function (instance) {
            adoption = instance;
            return adoption.register("name", "breed", 3, "location", "picture", {from: accounts[0]});
        }).then(async function (id) {
            var pet = await adoption.pets(16);
            assert.equal(pet[1], "name", "Error");
        }).catch(function (err) {
            assert.equal(1, 2, "Error");
        });
    });
});