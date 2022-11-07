import { Ballot__factory } from "./../typechain-types/factories/Ballot__factory";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";
import { Wallet } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

export async function getSigner() {
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
  });
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(
    `Working on Goerli Testnet connected to wallet ${signer.address} with balance of ${balance}`
  );
  return signer as Wallet;
}

export async function getLocalSigner(accNum = 0) {
  const accounts = await ethers.getSigners();
  const signer = accounts[accNum];
  const balance = await signer.getBalance();
  console.log(
    `Working on Local Blockchain connected to wallet ${signer.address} with balance of ${balance}`
  );
  return signer as unknown as Wallet;
}

export async function deploy(signer: Wallet, proposals: string[]) {
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  const ballotContractFacotry = new Ballot__factory(signer);
  const ballotContract = (await ballotContractFacotry.deploy(
    convertStringArrayToBytes32(proposals)
  )) as Ballot;
  await ballotContract.deployed();
  console.log(
    `The ballot smart contract was deployed at ${ballotContract.address}`
  );
  return ballotContract.address;
}

export const localDeploy = async (signer: Wallet) => {
  const proposals = ["chocolate", "vanilla", "cookie", "lemon"];
  return deploy(signer, proposals).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
};
