"use strict";

process.title = "Multithread Polkadot Bruteforce by CorvusCodex";

//Creaded by: Corvus Codex
//Github: https://github.com/CorvusCodex/
//Licence : MIT License

//Support my work:
//BTC: bc1q7wth254atug2p4v9j3krk9kauc0ehys2u8tgg3
//ETH & BNB: 0x68B6D33Ad1A3e0aFaDA60d6ADf8594601BE492F0
//Buy me a coffee: https://www.buymeacoffee.com/CorvusCodex

// Importing required modules
const CoinKey = require('coinkey');
const fs = require('fs');
const crypto = require('crypto');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const blessed = require('blessed');
const { Keyring } = require('@polkadot/keyring');
const { randomAsU8a, cryptoWaitReady } = require('@polkadot/util-crypto');

// Initializing a Set to store addresses
let addresses;
addresses = new Set();

// Reading data from a file named 'data.txt'
const data = fs.readFileSync('./data.txt');
// Splitting the data by new line and adding each address to the Set
data.toString().split("\n").forEach(address => {
    if (address.startsWith('0x')) {
        addresses.add(address);
    } else {
        console.error('Error: addresses are not in correct format. Adreess must be in Generic Substrate format and starts with "5".');
        process.exit(1);
    }
});

// Initializing an object to store counts for each worker
let counts = {};

// Function to generate a private key and check if the corresponding public address is in the Set of addresses
async function generate() {


    await cryptoWaitReady();
    // Create a new Keyring instance with the sr25519 key type
    const keyring = new Keyring({ type: 'sr25519' });
    // Generate a random seed using the randomAsU8a function
    const seed = randomAsU8a(32);
    // Add a new key pair to the keyring using the generated seed
    const pair = keyring.addFromSeed(seed);

    //console.log(pair.address)
    //console.log(seed.toString('hex'))

    // Incrementing the count for the current worker
    counts[cluster.worker.id] = (counts[cluster.worker.id] || 0) + 1;
    // Sending the updated counts to the master process
    process.send({counts: counts});

    // Checking if the public address corresponding to the private key is in the Set of addresses
    if(addresses.has(pair.address)){
    console.log("");
    // Making a beep sound :D
    process.stdout.write('\x07');
    // Logging success message with the public address in green color
    console.log("\x1b[32m%s\x1b[0m", ">> Match Found: " + pair.address);
    var successString = "Wallet: " + pair.address + "\n\nSeed: " + seed.toString('hex');

    // Saving the wallet and its private key (seed) to a file named 'match.txt'
    fs.writeFileSync('./match.txt', successString, (err) => {
    if (err) throw err;
    })
    // Exiting the process
    process.exit();
    }
}

// Checking if the current process is the master process
if (cluster.isMaster) {
 // Creating a blessed screen object
 let screen = blessed.screen({
 smartCSR: true
 });

 // Initializing an array to store boxes for each worker
 let boxes = [];

 // Looping through each CPU and creating a box for each worker
 for (let i = 0; i < numCPUs; i++) {
 let box = blessed.box({
 top: `${i * 100/numCPUs}%`,
 left: 0,
 width: '100%',
 height: `${100/numCPUs}%`,
 content: `Worker ${i+1} Loop count: 0`,
 border: {
 type: 'line'
 },
 style: {
 border: {
 fg: 'blue'
 }
 }
 });
 screen.append(box);
 boxes.push(box);
 }

 // Rendering the screen
 screen.render();

 // Listening for messages from worker processes
 cluster.on('message', (worker, message) => {
 if (message.counts) {
 for (let workerId in message.counts) {
 boxes[workerId-1].setContent(`Worker ${workerId} Loop count: ${message.counts[workerId]}`);
 }
 screen.render();
 }
 });

 // Forking worker processes for each CPU
 for (let i = 0; i < numCPUs; i++) {
 cluster.fork();
 }

 // Listening for exit event of worker processes
 cluster.on('exit', (worker, code, signal) => {
 console.log(`worker ${worker.process.pid} died`);
 });
} else {
 // Setting an interval to run the generate function repeatedly with no delay
 setInterval(generate, 0);
}
