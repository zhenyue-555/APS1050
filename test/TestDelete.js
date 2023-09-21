var Adoption = artifacts.require("./Adoption.sol");

contract("Delete", function (accounts) {
    var adoption;
    
    // Before running the test case, we will first register a pet.
    before(async function () {
        adoption = await Adoption.deployed();
        await adoption.register("name", "breed", 3, "location", "picture", {from: accounts[0]});
    });

    it("Delete a registered pet", function () {
        var initialCount;

        return adoption.count().then(function (count) {
            initialCount = count.toNumber();
            return adoption.deletePet(initialCount - 1, {from: accounts[0]});
        }).then(async function () {
            var newCount = (await adoption.count()).toNumber();
            assert.equal(newCount, initialCount - 1, "The pet count should decrease by one after deleting");

            // Check if the last pet has been removed
            return adoption.pets(newCount - 1);
        }).then(function (pet) {
            assert.notEqual(pet[1], "name", "Pet with the name 'name' should have been deleted");
        }).catch(function (err) {
            assert.fail(err.toString());
        });
    });
});
