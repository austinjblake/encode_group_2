import { getLocalSigner, localDeploy } from "./Deployments";
import { vote } from "./Vote";

// yarn run ts-node --files ./scripts/_giveRightToVote.ts VOTE

(async () => {
  const signer = await getLocalSigner();
  const ballotAddress = await localDeploy(signer);
  vote(signer, ballotAddress ?? "", parseInt(process.argv[2] ?? "")).catch(
    (error) => {
      console.error(error);
      process.exitCode = 1;
    }
  );
})();
