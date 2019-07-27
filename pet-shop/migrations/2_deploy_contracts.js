const Adoption = artifacts.require("Adoption");

// Deploys the Adoption smart contract
module.exports = function(deployer) {
	deployer.deploy(Adoption);
};
