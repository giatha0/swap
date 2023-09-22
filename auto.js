

const Web3 = require('web3');
const abi = require('./abi.json');
require('dotenv').config()

// Create a new web3 instance
const web3 = new Web3('https://lb.drpc.org/ogrpc?network=mantle&dkey=ArPEFE2Y6kOtrRineiDKdUfvlMlrWR0R7oS5FnomaLKw');

// Set the contract address and ABI
const contractAddress = '0x319B69888b0d11cEC22caA5034e25FfFBDc88421';
const contractABI = abi;

// Create a contract instance
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Set the number of times to run the transaction
const numTransactions = 100;

// Set the parameters for the exactInputSingle function
const params = {
    tokenIn: '0x78c1b0c915c4faa5fffa6cabf0219da63d7f4cb8', // Address of the token you want to swap from
    tokenOut: '0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9', // Address of the token you want to swap to
    fee: 500, // Fee amount (uint24)
    recipient: process.env.yourAdress, // Address to receive the swapped tokens
    deadline: Math.floor(Date.now() / 1000) + 3600, // Set the deadline to 1 hour from now
    amountIn: '10000000000000000', // Amount of tokenIn to swap (e.g., 1 token)
    amountOutMinimum: '3950', // Minimum amount of tokenOut you expect to receive
    sqrtPriceLimitX96: '0' // Set the sqrtPriceLimitX96 value (uint160)
};

// Create a function to run the transaction
async function runTransaction() {
    try {
        // Encode the function call data
        const functionData = contract.methods.exactInputSingle(params).encodeABI();
        console.log('txn', functionData);
        // Create a transaction object
        const txObject = {
            to: contractAddress,
            data: functionData,
            value: web3.utils.toWei('0.01', 'ether'), // Optional: Amount of ETH to send along with the transaction
            gasLimit: '280000', // Adjust the gas limit as needed
            gasPrice: web3.utils.toWei('0.05', 'gwei')  // Set the gas price in Gwei
        };

        // Sign the transaction using a private key
        const privateKey = process.env.privateKey;
        const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

        // Send the signed transaction
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log('Transaction Receipt:', receipt);
    } catch (error) {
        console.error('Transaction Error:', error);
    }
}

// Run the transaction multiple times
async function runMultipleTransactions() {
    for (let i = 0; i < numTransactions; i++) {
        console.log(`Running transaction ${i + 1}...`);
        await runTransaction();
        console.log(`Transaction ${i + 1} completed.`);
    }
}

// Start running the multiple transactions
runMultipleTransactions();