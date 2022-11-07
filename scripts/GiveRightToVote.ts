import { ethers } from "ethers";
import { Ballot__factory } from "./../typechain-types/factories/Ballot__factory";
import { Ballot } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

async function giveVotingRight() {
  // use ethers to connect to goerli and wallet to create a signer
  const provider = ethers.getDefaultProvider("goerli", {
    alchemy: process.env.ALCHEMY_API_KEY,
  });
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  const signer = wallet.connect(provider);
  const balance = await signer.getBalance();
  console.log(
    `Working on Goerli Testnet connected to wallet ${signer.address} with balance of ${balance}`
  );
  // use signer and contract address from command line argument to connect to ballot contract on chain
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = (await ballotContractFactory.attach(
    process.argv[2]
  )) as Ballot;
  console.log("sending permission txn");
  // give voting right to wallet address passed in command line argument
  const vote = await ballotContract.giveRightToVote(process.argv[3]);
  await vote.wait();
  // query ballot contract to get info on new voter
  const newVoter = await ballotContract.voters(process.argv[3]);
  console.log(
    `Voter at ${process.argv[3]} has voter weight of ${newVoter.weight}`
  );
}

giveVotingRight().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
