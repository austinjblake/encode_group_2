import { Ballot__factory } from "./../typechain-types/factories/Ballot__factory";
import { ethers } from "ethers";
import { Ballot } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function deploy() {
  // use ethers to connect to goerli and wallet to create a signer
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: process.env.INFURA_API_KEY,
    etherscan: process.env.ETHERSCAN_API_KEY,
  });
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(
    `Working on Goerli Testnet connected to wallet ${signer.address} with balance of ${balance}`
  );
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  // proposals are passed as arguments when running script on command line
  const proposals = process.argv.slice(2);
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  // get ballot factory and use it to deploy and instance of ballot contract
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = (await ballotContractFactory.deploy(
    convertStringArrayToBytes32(proposals)
  )) as Ballot;
  await ballotContract.deployed();
  console.log(
    `The ballot smart contract was deployed at ${ballotContract.address}`
  );
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
