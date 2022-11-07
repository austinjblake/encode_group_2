import { delegateVote } from "./Delegate";
import { getLocalSigner, localDeploy } from "./Deployments";
import { giveVotingRight } from "./GiveRightToVote";

// yarn run ts-node --files ./scripts/_localDelegate.ts

(async () => {
  const signer = await getLocalSigner();
  const ballotAddress = await localDeploy(signer);
  const delegateVoter = await getLocalSigner(2);
  await giveVotingRight(
    signer,
    ballotAddress ?? "",
    delegateVoter.address
  ).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  delegateVote(signer, ballotAddress ?? "", delegateVoter.address).catch(
    (error) => {
      console.error(error);
      process.exitCode = 1;
    }
  );
})();
