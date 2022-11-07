import { ethers } from "ethers";
import { Ballot__factory } from "./../typechain-types/factories/Ballot__factory";
import { Ballot } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

export async function getResults() {
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
  // connect to ballot contract at address from command line argument
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = (await ballotContractFactory.attach(
    process.argv[2]
  )) as Ballot;
  // call ballot functions to get winning proposal name and index. use index to get proposal info for number of votes
  const propIndex = await ballotContract.winningProposal();
  const propName = await ballotContract.winnerName();
  const prop = await ballotContract.proposals(propIndex);
  console.log(
    `Proposal #${
      parseInt(propIndex.toString()) + 1
    } ${ethers.utils.parseBytes32String(propName)} is winning with ${
      prop.voteCount
    } votes`
  );
}

getResults().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
