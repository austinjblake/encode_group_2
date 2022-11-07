import { giveVotingRight } from "./GiveRightToVote";
import { getSigner } from "./Deployments";

// yarn run ts-node --files ./scripts/_giveRightToVote.ts CONTRACT_ADDRESS NEW_VOTER_ADDRESS

(async () => {
  const signer = await getSigner();
  giveVotingRight(signer, process.argv[2] ?? "", process.argv[3] ?? "").catch(
    (error) => {
      console.error(error);
      process.exitCode = 1;
    }
  );
})();
