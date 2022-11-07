import { deploy, getSigner } from "./Deployments";

// yarn run ts-node --files ./scripts/_giveRightToVote.ts PROPOSAL1 PROPOSAL2 PROPOSAL3 PROPOSAL4

(async () => {
  const signer = await getSigner();
  const proposals = process.argv.slice(2);
  deploy(signer, proposals).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
})();
