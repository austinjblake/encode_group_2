import { getLocalSigner, localDeploy } from "./Deployments";
import { giveVotingRight } from "./GiveRightToVote";

// yarn run ts-node --files ./scripts/_localRight.ts

(async () => {
  const signer = await getLocalSigner();
  const ballotAddress = await localDeploy(signer);
  const newVoter = await getLocalSigner(2);
  giveVotingRight(signer, ballotAddress ?? "", newVoter.address).catch(
    (error) => {
      console.error(error);
      process.exitCode = 1;
    }
  );
})();
