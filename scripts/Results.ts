import { Wallet } from "ethers";
import { Ballot__factory } from "./../typechain-types/factories/Ballot__factory";
import { Ballot } from "../typechain-types";
import { ethers } from "hardhat";

export async function getResults(signer: Wallet, contractAddress: string) {
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = (await ballotContractFactory.attach(
    contractAddress
  )) as Ballot;
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
