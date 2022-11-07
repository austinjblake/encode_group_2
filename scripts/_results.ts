import { getSigner } from "./Deployments";
import { getResults } from "./Results";

// yarn run ts-node --files ./scripts/_results.ts CONTRACT_ADDRESS

(async () => {
  const signer = await getSigner();
  getResults(signer, process.argv[2] ?? "").catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
})();
