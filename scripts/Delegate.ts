import { Wallet } from "ethers";
import { Ballot__factory } from "./../typechain-types/factories/Ballot__factory";
import { Ballot } from "../typechain-types";

export async function delegateVote(
  signer: Wallet,
  contractAddress = "",
  delegateAddress = ""
) {
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = (await ballotContractFactory.attach(
    contractAddress
  )) as Ballot;
  console.log("sending delegation txn");
  const delegate = await ballotContract.delegate(delegateAddress);
  await delegate.wait();
  const delegateVoter = await ballotContract.voters(delegateAddress);
  console.log(
    `Voter at ${delegateAddress} has voter weight of ${delegateVoter.weight}`
  );
}
