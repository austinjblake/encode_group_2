import { Wallet } from "ethers";
import { Ballot__factory } from "./../typechain-types/factories/Ballot__factory";
import { Ballot } from "../typechain-types";
//import { ethers } from "hardhat";

export async function vote(
  signer: Wallet,
  contractAddress = "",
  propIndex = 0
) {
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = (await ballotContractFactory.attach(
    contractAddress
  )) as Ballot;
  console.log("sending vote");
  const vote = await ballotContract.vote(propIndex);
  await vote.wait();
  console.log("vote made");
  // const prop1 = await ballotContract.proposals(0);
  // const prop2 = await ballotContract.proposals(1);
  // const prop3 = await ballotContract.proposals(2);
  // const prop4 = await ballotContract.proposals(3);
  // console.log(
  //   `${ethers.utils.parseBytes32String(prop1.name)}: ${prop1.voteCount}`
  // );
  // console.log(
  //   `${ethers.utils.parseBytes32String(prop2.name)}: ${prop2.voteCount}`
  // );
  // console.log(
  //   `${ethers.utils.parseBytes32String(prop3.name)}: ${prop3.voteCount}`
  // );
  // console.log(
  //   `${ethers.utils.parseBytes32String(prop4.name)}: ${prop4.voteCount}`
  // );
}
