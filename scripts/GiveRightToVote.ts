import { Wallet } from "ethers";
import { Ballot__factory } from "./../typechain-types/factories/Ballot__factory";
import { Ballot } from "../typechain-types";

export async function giveVotingRight(
  signer: Wallet,
  contractAddress = "",
  voterAddress = ""
) {
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = (await ballotContractFactory.attach(
    contractAddress
  )) as Ballot;
  console.log("sending permission txn");
  const vote = await ballotContract.giveRightToVote(voterAddress);
  await vote.wait();
  const newVoter = await ballotContract.voters(voterAddress);
  console.log(
    `Voter at ${voterAddress} has voter weight of ${newVoter.weight}`
  );
}
