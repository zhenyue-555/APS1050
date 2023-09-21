const adoption_map = new Map();
let pets = [];

App = {
    web3Provider: null, 
    contracts: {},
    init: async function () {

        return await App.initWeb3();
    }
    ,

    initWeb3: async function () {
        adoption_map.set("Gina", 1)
        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
// Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
// If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    }
    ,

    initContract: function () {
        $.getJSON('Adoption.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract
            var AdoptionArtifact = data;
            App.contracts.Adoption = TruffleContract(AdoptionArtifact);

            // Set the provider for our contract
            App.contracts.Adoption.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the adopted pets
            //return App.markAdopted();
        });

        return App.bindEvents();
    }
    ,
    // if an element with the class .btn-adopt is clicked, the App.handleAdopt function will be triggered.
    bindEvents: function () {
        $(document).on('click', '.btn-adopt', App.handleAdopt);
        $(document).on('click', '.btn-return', App.handleReturn);
        $(document).on('click', '.btn-register', App.handleRegister);
        $(document).on('click', '.btn-delete', App.handleDelete);
        $(document).on('click', '.btn-update', App.handleUpdate); 
        $(document).on('click', '.btn-vote', App.handleVote);
    }
    ,


    getPets: function () {
            // This function returns a Promise that either resolves with a list of pets or rejects with an error.
        return new Promise(function(resolve, reject) {
        var adoptionInstance;
        pets = [];
        App.contracts.Adoption.deployed().then(function (instance) {
            adoptionInstance = instance;
            return adoptionInstance.count();
        }).then(function (count) {
            var allpets = [];
            for (var i = 0; i < count; i++) {
                allpets.push(adoptionInstance.pets(i));
            }
            // Fetches each pet using the pets() function from the contract. All these promises are gathered and resolved using Promise.all()
            Promise.all(allpets).then(function (values) {
                for (var i = 0; i < count; i++) {
                    var id = values[i][0];
                    var petName = values[i][1];
                    var petBreed = values[i][2];
                    var petAge = values[i][3];
                    var petLoc = values[i][4];
                    var petImg = values[i][5];
                    var status = values[i][6];
                    var votes = values[i][7];
                    pets.push({
                        "id": id,
                        "name": petName,
                        "breed": petBreed,
                        "age": petAge,
                        "location": petLoc,
                        "picture": petImg,
                        "status": status,
                        "votes": votes
                    })
                }
                resolve(pets);
            }).catch(function (err) {
                console.log(err.message);
            });
        }).catch(function (err) {
            console.log(err.message);
        });
        });
    }
    ,
    // Event handlers (e.g., handleAdopt, handleReturn, handleRegister, handleDelete, handleUpdate)use web3.eth.getAccounts() which fetches the Ethereum accounts. This is a callback-based method.
    handleAdopt: function (event) {
        event.preventDefault();

        var petId = parseInt($(event.target).data('id'));

        var adoptionInstance;

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];
            // Once the account is fetched, they interact with the smart contract using the deployed() method to get the deployed contract instance
            App.contracts.Adoption.deployed().then(function (instance) {
                adoptionInstance = instance;
                //call specific contract methods (adopt)
                return adoptionInstance.adopt(petId, {from: account});
            }).then(function (result) {
                alert('Adopted successfully!');
                location.reload();
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    }
    ,
    handleReturn: function (event) {
        event.preventDefault();

        var petId = parseInt($(event.target).data('id'));

        var adoptionInstance;

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Adoption.deployed().then(function (instance) {
                adoptionInstance = instance;
                return adoptionInstance.readopt(petId, {from: account});
            }).then(function (result) {
                alert("Pet returned successfully!");
                location.reload();
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    }
    ,
    handleDelete: function (event) {
        event.preventDefault();
    
        var petNameToDelete = $('#petName').val();
        var adoptionInstance;
        
        App.getPets().then(function() {
            var petId = -1;
    
            for(let pet of pets) {
                if(pet.name === petNameToDelete) {
                    petId = parseInt(pet.id);
                    break;
                }
            }
    
            if(petId === -1) {
                alert('Pet not found with the given name: ' + petNameToDelete);
                return;
            }
            console.log(petId);
    
            web3.eth.getAccounts(function (error, accounts) {
                if (error) {
                    console.log(error);
                }
    
                var account = accounts[0];
                App.contracts.Adoption.deployed().then(function (instance) {
                    adoptionInstance = instance;
                    return adoptionInstance.deletePet(petId, {from: account});
                }).then(function (result) {
                    alert("Pet deleted successfully!");
                    location.reload();
                }).catch(function (err) {
                    console.log(err.message);
                    alert("Error deleting the pet!");
                });
            });
            });
    
    }
    ,
    handleUpdate: function (event) {
        event.preventDefault();
    
        var petNameToDelete = $('#name').val();
        
        App.getPets().then(function() {
            var petId = -1;
    
            for(let pet of pets) {
                if(pet.name === petNameToDelete) {
                    petId = parseInt(pet.id);
                    break;
                }
            }
    
            if(petId === -1) {
                alert('Pet not found with the given name: ' + petNameToDelete);
                return;
            }
            console.log(petId); 
            var updatedPet = {
                "name": $("#name").val(),         
                "breed": $("#breed").val(),
                "age": parseInt($("#age").val()),
                "location": $("#location").val(),
                "picture": $("#picture").val(),
                'votes': '0',
            }
        
            var adoptionInstance;
            console.log(updatedPet);
        
            web3.eth.getAccounts(function (error, accounts) {
                if (error) {
                    console.log(error);
                }
        
                var account = accounts[0];
                App.contracts.Adoption.deployed().then(function (instance) {
                    adoptionInstance = instance;
                    console.log(updatedPet);
                    return adoptionInstance.updatePetDetails(
                        petId, 
                        updatedPet.name, 
                        updatedPet.breed, 
                        updatedPet.age, 
                        updatedPet.location, 
                        updatedPet.picture,
                        updatedPet.votes,
                        {from: account}
                    );
                }).then(function (result) {
                    alert("Pet updated successfully!");
                    location.reload();
                }).catch(function (err) {
                    console.log(err.message);
                });
        });
    });
    }
    ,   
    
    handleVote: function(event) {
        event.preventDefault();
    
        var petId = parseInt($(event.target).data('id'));
    
        var adoptionInstance;
    
        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }
    
            var account = accounts[0];
    
            App.contracts.Adoption.deployed().then(function (instance) {
                adoptionInstance = instance;
                
                // call the voteForPet function from our contract
                return adoptionInstance.voteForPet(petId, {from: account});
            }).then(function (result) {
                alert('Thanks for voting!');
                location.reload();
            }).catch(function(err) {
                console.log(err.message);
            });
        });
    }
,    

    handleRegister: function (event) {
        event.preventDefault();

        var pet = {
            "name": $("#name").val(),
            "picture": $("#picture").val(),
            "age": parseInt($("#age").val()),
            "breed": $("#breed").val(),
            "location": $("#location").val(),
        }

        var adoptionInstance;

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Adoption.deployed().then(function (instance) {
                adoptionInstance = instance;
                return adoptionInstance.register(pet.name, pet.breed, pet.age, pet.location, pet.picture, {from: account});
            }).then(function (result) {
                alert("Pet registered successfully!");
                location.reload();
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    }

}
;

$(function () {
    $(window).load(function () {
        App.init();
    });
});
