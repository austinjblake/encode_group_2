import { getSigner } from "./Deployments";
import { vote } from "./Vote";

// yarn run ts-node --files ./scripts/_vote.ts CONTRACT_ADDRESS VOTE

(async () => {
  const signer = await getSigner();
  vote(signer, process.argv[2] ?? "", parseInt(process.argv[3] ?? "")).catch(
    (error) => {
      console.error(error);
      process.exitCode = 1;
    }
  );
})();
