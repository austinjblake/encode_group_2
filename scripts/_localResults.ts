import { getResults } from "./Results";
import { getLocalSigner, localDeploy } from "./Deployments";
import { giveVotingRight } from "./GiveRightToVote";
import { vote } from "./Vote";

// yarn run ts-node --files ./scripts/_localResults.ts VOTE1 VOTE2 VOTE3

(async () => {
  const signer = await getLocalSigner();
  const ballotAddress = await localDeploy(signer);
  const newVoter = await getLocalSigner(1);
  await giveVotingRight(signer, ballotAddress ?? "", newVoter.address).catch(
    (error) => {
      console.error(error);
      process.exitCode = 1;
    }
  );
  const newVoter2 = await getLocalSigner(2);
  await giveVotingRight(signer, ballotAddress ?? "", newVoter2.address).catch(
    (error) => {
      console.error(error);
      process.exitCode = 1;
    }
  );
  await vote(signer, ballotAddress ?? "", parseInt(process.argv[2] ?? ""));
  await vote(newVoter, ballotAddress ?? "", parseInt(process.argv[3] ?? ""));
  await vote(newVoter2, ballotAddress ?? "", parseInt(process.argv[4] ?? ""));
  getResults(signer, ballotAddress ?? "").catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
})();
