// require('dotenv').config();
const API_URL =
  'https://eth-mainnet.g.alchemy.com/v2/EIXoDo9vR8izGHBd-PohuN-uaYO1jAb6';
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(API_URL);
const contract = require('./contractAbi2.json');

const alchemyApiKey = process.env.ALCHEMY_API_KEY;
const PRIVATE_KEY =
  'bc406b2e93872d6c97bfb58ec0a5182c53d8ab006b2aec14890acaa668e1d5a6';
const PUBLIC_KEY = '0x98B2859976cA52250dfc79cc86f469a9bEcE30ED';

const contractAddress = '0x47EbaB13B806773ec2A2d16873e2dF770D130b50';
const refD = new web3.eth.Contract(contract.abi, contractAddress);
// const contractAddress = "0x70c86b8d660eBd0adef24E9ACcb389BFb6611B2b";
const contractTest1 = new web3.eth.Contract(contract.abi, contractAddress);

async function callContract() {
  const message = await contractTest1.methods.name().call();
  console.log('The message is: ' + message);
}
//  callContract();

const submitD = '1000000000000000000'; ////this value is in wei
// const refD = '0xA3b538Ff42bE5eb2c1C93f52aB626f9C449c7557';
// const data ={
//     "submit" : "0.0012",
//     "_referral": "0xA3b538Ff42bE5eb2c1C93f52aB626f9C449c7557"
// }


async function submitCall(submitD, refD) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, 'latest'); // get latest nonce
  const gasEstimate = await contractTest1.methods.submit().estimateGas();
  // const gasEstimate = await helloWorldContract.methods.update(newMessage).estimateGas(); // estimate gas

  // Create the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    value: submitD,
    nonce: nonce,
    gas: '21432', ///cehck for gas
    data: contractTest1.methods.submit(refD).encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              'The hash of your transaction is: ',
              hash,
              "\n Check Alchemy's Mempool to view the status of your transaction!",
            );
          } else {
            console.log(
              'Something went wrong when submitting your transaction:',
              err,
            );
          }
        },
      );
    })
    .catch((err) => {
      console.log('Promise failed:', err);
    });
}

async function submitTest1() {
  await submitCall(submitD, refD);
}

submitTest1();

// async function main() {
//     const message = await helloWorldContract.methods.message().call();
//     console.log("The message is: " + message);
//   }

// main();
