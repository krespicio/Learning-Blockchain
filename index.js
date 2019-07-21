// Part One: Understanding Blockchain
// Kyle Respicio

const sha256 = require("crypto-js/sha256");

class Block {
    constructor(data, previous) {
        this.timeStamp = new Date();
        this.data = data;
        this.previousHash = previous;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return sha256(
            this.timeStamp + this.previousHash + JSON.stringify(this.data)
        ).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block("Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(data) {
        this.chain.push(new Block(data, this.getLatestBlock().hash));
    }

    validate() {
        for (let i = 1, size = this.chain.length; i < size; i = i + 1) {
            // Make sure every hash is valid
            if (this.chain[i].hash !== this.chain[i].calculateHash()) {
                console.log("Data is tampered");
                return false;
            }

            // Make sure every previous hash matches
            if (this.chain[i].previousHash !== this.chain[i - 1].hash) {
                console.log("Hash dones't match");
                return false;
            }
        }

        return true;
    }
}

let coinChain = new Blockchain();
coinChain.addBlock({ to: "Sherman", from: "Kyle", payment: "15" });
coinChain.addBlock({ to: "Sherman", from: "Memo", payment: "25" });

console.log(JSON.stringify(coinChain, null, 4));
console.log("Is this chain valid?", coinChain.validate() ? "yes" : "no");

console.log("Modify the blockchain: Sherman hacks the payment");
coinChain.chain[1].data = { to: "Sherman", from: "Kyle", payment: "100" };
console.log(JSON.stringify(coinChain, null, 4));
console.log("Is this chain valid?", coinChain.validate() ? "yes" : "no");

console.log(
    "Modify the blockchain: Sherman hacks the payment and recalculates the hash"
);
coinChain.chain[1].data = { to: "Sherman", from: "Kyle", payment: "100" };
coinChain.chain[1].hash = coinChain.chain[1].calculateHash();
console.log(JSON.stringify(coinChain, null, 4));
console.log("Is this chain valid?", coinChain.validate() ? "yes" : "no");
