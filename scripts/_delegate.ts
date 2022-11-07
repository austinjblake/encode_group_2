import { delegateVote } from "./Delegate";
import { getSigner } from "./Deployments";

// yarn run ts-node --files ./scripts/_delegate.ts CONTRACT_ADDRESS NEW_DELEGATE_ADDRESS

(async () => {
  const signer = await getSigner();
  delegateVote(signer, process.argv[2] ?? "", process.argv[3] ?? "").catch(
    (error) => {
      console.error(error);
      process.exitCode = 1;
    }
  );
})();
