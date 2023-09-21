pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;  // This is for returning structs directly.

// Contract for handling pet adoptions.
contract Adoption {

    // Define a Pet with various attributes.
    struct Pet {
        uint id;           // Unique ID for the pet.
        string name;       // Name of the pet.
        string breed;      // Breed of the pet.
        uint age;          // Age of the pet.
        string location;   // Location of the pet.
        string picture;    // URL or location for the pet's picture.
        address status;    // Address of the owner. '0' address means it's available for adoption.
        uint votes;      // Number of votes (or likes) the pet has received.
    }

    mapping(uint => mapping(address => bool)) public petVotes;

    // Dynamic array of all the pets.
    Pet[] public pets;

    // Counter to keep track of total number of pets.
    uint public count;

    // Function to cast a vote (or like) for a pet
    function voteForPet(uint petId) public {
        require(petId >= 0 && petId < count, "Invalid pet ID.");           // Check if petId is valid.
        require(!petVotes[petId][msg.sender], "You have already voted for this pet.");  // Ensure the user hasn't already voted for this pet.

        pets[petId].votes += 1;              // Increment the vote (or like) count for the pet.
        petVotes[petId][msg.sender] = true;  // Mark that this user has voted for this pet.
    }


    // Function for a user to adopt a pet.
    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId < count);                 // Check if petId is valid.
        require(pets[petId].status == address(0));           // Ensure the pet isn't already adopted.
        pets[petId].status = msg.sender;                     // Set the pet's status to the adopter's address.
        return petId;
    }

    // Function for an owner to return the pet.
    function readopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId < count);                 // Check if petId is valid.
        require(pets[petId].status == msg.sender);           // Ensure the sender is the pet's owner.
        pets[petId].status = address(0);                     // Reset the pet's status to available.
        return petId;
    }

    // Function to register a new pet.
    function register(string memory name, string memory breed, uint age, string memory location, string memory image) public {
        address default_address = address(0);                // The default address (no owner).
        pets.push(Pet(count, name, breed, age, location, image, default_address, 0));  // Add the pet to the pets array.
        count = count + 1;                                  // Increment the pets counter.
    }

    // Function to delete a pet.
    function deletePet(uint petId) public {
        require(petId >= 0 && petId < count);                // Check if petId is valid.
        require(pets[petId].status == address(0));          // Ensure the pet isn't adopted.

        // If it's not the last pet, move the last pet to the deleted pet's location.
        if (petId != count - 1) {
            pets[petId] = pets[count-1];
        }

        // Remove the last pet from the array (it's now a duplicate or it's the pet to be deleted).
        pets.pop();
        count = count - 1;                                  // Decrement the pets counter.
    }

//get all pets information
    function getPetDetails(uint petId) public view returns (Pet memory) {
    require(petId >= 0 && petId < count);
    return pets[petId];
}

    // Function to update pet details.
    function updatePetDetails(uint petId, string memory name, string memory breed, uint age, string memory location, string memory image, uint votecount) public {
        require(petId >= 0 && petId < count);                 // Check if petId is valid.
        pets[petId].name = name;                             // Update name.
        pets[petId].breed = breed;                           // Update breed.
        pets[petId].age = age;                               // Update age.
        pets[petId].location = location;                     // Update location.
        pets[petId].picture = image;                         // Update picture URL.
        pets[petId].votes = votecount;
    }

// Constructor to initialize the contract with some default pets.
    constructor () public {
        address default_address = address(0);
        count = 16;
        pets.push(Pet(0, "Frieda", "Scottish Terrier", 3, "Lisco, Alabama", "images/scottish-terrier.jpeg", default_address, 0));
        pets.push(Pet(1, "Gina", "Scottish Terrier", 3, "Tooleville, West Virginia", "images/scottish-terrier.jpeg", default_address, 0));
        pets.push(Pet(2, "Collins", "French Bulldog", 2, "Freeburn, Idaho", "images/french-bulldog.jpeg", default_address, 0));
        pets.push(Pet(3, "Melissa", "Boxer", 2, "Camas, Pennsylvania", "images/boxer.jpeg", default_address, 0));
        pets.push(Pet(4, "Jeanine", "French Bulldog", 2, "Gerber, South Dakota", "images/french-bulldog.jpeg", default_address, 0));
        pets.push(Pet(5, "Elvia", "French Bulldog", 3, "Innsbrook, Illinois", "images/french-bulldog.jpeg", default_address, 0));
        pets.push(Pet(6, "Latisha", "Golden Retriever", 3, "Soudan, Louisiana", "images/golden-retriever.jpeg", default_address, 0));
        pets.push(Pet(7, "Coleman", "Golden Retriever", 3, "Jacksonwald, Palau", "images/golden-retriever.jpeg", default_address, 0));
        pets.push(Pet(8, "Nichole", "French Bulldog", 2, "Honolulu, Hawaii", "images/french-bulldog.jpeg", default_address, 0));
        pets.push(Pet(9, "Fran", "Boxer", 3, "Matheny, Utah", "images/boxer.jpeg", default_address, 0));
        pets.push(Pet(10, "Leonor", "Boxer", 2, "Tyhee, Indiana", "images/boxer.jpeg", default_address, 0));
        pets.push(Pet(11, "Dean", "Scottish Terrier", 3, "Windsor, Montana", "images/scottish-terrier.jpeg", default_address, 0));
        pets.push(Pet(12, "Stevenson", "French Bulldog", 3, "Kingstowne, Nevada", "images/french-bulldog.jpeg", default_address, 0));
        pets.push(Pet(13, "Kristina", "Golden Retriever", 4, "Sultana, Massachusetts", "images/golden-retriever.jpeg", default_address, 0));
        pets.push(Pet(14, "Ethel", "Golden Retriever", 2, "Broadlands, Oregon", "images/golden-retriever.jpeg", default_address, 0));
        pets.push(Pet(15, "Terry", "Golden Retriever", 2, "Dawn, Wisconsin", "images/golden-retriever.jpeg", default_address, 0));
    }

}
