import { ethers } from "ethers";
import { Ballot__factory } from "./../typechain-types/factories/Ballot__factory";
import { Ballot } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

export async function vote() {
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
  // connect to onchain ballot contract at address from command line argument
  const ballotContractFactory = new Ballot__factory(signer);
  const ballotContract = (await ballotContractFactory.attach(
    process.argv[2]
  )) as Ballot;
  console.log("sending vote");
  // call ballot function to vote for proposal with index from command line argument
  const vote = await ballotContract.vote(process.argv[3]);
  await vote.wait();
  console.log("vote made");
}

vote().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
