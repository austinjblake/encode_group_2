import { ethers } from "ethers";
import { Ballot__factory } from "./../typechain-types/factories/Ballot__factory";
import { Ballot } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

export async function delegateVote() {
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
  // connect to ballot contract onchain with signer and contract address from command line argument
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = (await ballotContractFactory.attach(
    process.argv[2]
  )) as Ballot;
  console.log("sending delegation txn");
  // call ballot function to delegate vote from signer to delegation wallet passed in from command line
  const delegateAddress = process.argv[3];
  const delegate = await ballotContract.delegate(delegateAddress);
  await delegate.wait();
  // query ballot contract to check new voting power of delegation address
  const delegateVoter = await ballotContract.voters(delegateAddress);
  console.log(
    `Voter at ${delegateAddress} has voter weight of ${delegateVoter.weight}`
  );
}

delegateVote().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
