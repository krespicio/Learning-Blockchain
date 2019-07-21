// Part One: Understanding Blockchain
// Kyle Respicio

const sha256 = require("crypto-js/sha256");

class Transaction {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

class Block {
    constructor(transaction, previous) {
        this.timeStamp = new Date();
        this.transaction = transaction;
        this.previousHash = previous;
        this.hash = this.calculateHash();
        this.nonce = Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER);
    }

    calculateHash() {
        return sha256(
            this.timeStamp + this.previousHash + JSON.stringify(this.transaction) + this.nonce
        ).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce = this.nonce + 1;
            this.hash = this.calculateHash();
        }
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1;
        this.pendingTransactions = [];
        this.miningReward = 5;
    }

    createGenesisBlock() {
        return new Block("Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // addBlock(data) {
    //     let newBlock = new Block(data, this.getLatestBlock().hash);
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    // This is structured if each block can only contain a single transaction
    minePendingTransactions(minerAddress) {
        if (this.pendingTransactions.length === 0) {
            throw "There are currently no transactions";
        }
        let newBlock = new Block(this.pendingTransactions.pop(), this.getLatestBlock().hash);
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);

        this.pendingTransactions = [new Transaction(null, minerAddress, this.miningReward)];
    }

    checkMinerBalance(minerAddress) {
        return this.chain.reduce((acc, block) => {
            if (minerAddress === block.transaction.from) {
                return acc - block.transaction.amount;
            } else if (minerAddress === block.transaction.to) {
                return acc + block.transaction.amount;
            } else {
                return acc + 0;
            }
        }, 0);
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
const uberEatsTransaction = new Transaction("Kyle", "Uber", 20);
const uberTransaction = new Transaction("Kyle", "Uber", 43);
coinChain.createTransaction(uberEatsTransaction);
coinChain.createTransaction(uberTransaction);
coinChain.minePendingTransactions("Sherman");
coinChain.minePendingTransactions("Sherman");
console.log("Kyle has a balance of", coinChain.checkMinerBalance("Kyle"));
console.log("Uber has a balance of", coinChain.checkMinerBalance("Uber"));
console.log("Sherman has a balance of", coinChain.checkMinerBalance("Sherman"));

////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////Additional Tesing////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// coinChain.addBlock({ to: "Sherman", from: "Kyle", payment: "15" });
// coinChain.addBlock({ to: "Sherman", from: "Memo", payment: "25" });

// console.log(JSON.stringify(coinChain, null, 4));
// console.log("Is this chain valid?", coinChain.validate() ? "yes" : "no");

// console.log("Modify the blockchain: Sherman hacks the payment");
// coinChain.chain[1].data = { to: "Sherman", from: "Kyle", payment: "100" };
// // console.log(JSON.stringify(coinChain, null, 4));
// console.log("Is this chain valid?", coinChain.validate() ? "yes" : "no");

// console.log("Modify the blockchain: Sherman hacks the payment and recalculates the hash");
// coinChain.chain[1].data = { to: "Sherman", from: "Kyle", payment: "100" };
// coinChain.chain[1].hash = coinChain.chain[1].calculateHash();
// // console.log(JSON.stringify(coinChain, null, 4));
// console.log("Is this chain valid?", coinChain.validate() ? "yes" : "no");

// console.log(new Transaction("sherman", "kyle", 50));
