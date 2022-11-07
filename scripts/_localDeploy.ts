import { deploy, getLocalSigner } from "./Deployments";

// yarn run ts-node --files ./scripts/_localDeploy.ts

(async () => {
  const proposals = ["chocolate", "vanilla", "cookie", "lemon"];
  const signer = await getLocalSigner();
  deploy(signer, proposals).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
})();
