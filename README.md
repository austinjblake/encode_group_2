# ETHdenver Group Project #2

## Setup

create new folder "Project2"

open terminal inside "Project2"

enter these commands in your terminal. press enter after each:

- git clone https://github.com/austinjblake/encode_group_2.git
- cd encode_group_2

#### If using Yarn:

- yarn
- yarn hardhat compile

#### If using NPM:

- npm install
- npx hardhat compile

Project is now installed on your machine.

".env" file is needed. create a new one or copy one from another lesson and paste it inside the ballot folder

.env needs to have a "PRIVATE_KEY=xxxxxxxxxxxxxx" where private key is exported from your metamask

MAKE SURE THIS ACCOUNT IS ONLY FOR CODING AND HAS NO REAL MONEY IN IT!!!!!!!!!!

now that you have your private key in .env open the .gitignore file and double check .env is listed in there so your key is not added to git changes

.env can also have api keys to help prevent rate limiting. do one or all or none your script should still work

"ALCHEMY_API_KEY=xxxxxxxxxxxx" you can create an account on alchemy for free and create an api key to put here

"INFURA_API_KEY=xxxxxxxxxxxx" you can create an account on infura for free and create an api key to put here

"ETHERSCAN_API_KEY=xxxxxxxxxxxx" you can create an account on etherscan for free and create an api key to put here

#### Feel free at this point to try out "yarn hardhat test" or "npx hardhat test" to run the test suite. Not required

## Scripts

For the following command line scripts-if using Yarn, paste scripts as is. If using npm, replace "yarn run" with "npx"

### Deployment

this step is not needed if interacting with a contract already on the blockchain

if you want to deploy your own, enter the command below in the terminal and substitute the names of the proposals you want to use for PROPOSAL1, PROPOSAL 2...

- yarn run ts-node --files ./scripts/Deployments.ts PROPOSAL1 PROPOSAL2 PROPOSAL3 PROPOSAL4

after this is run the console will print out the address of the newly deployed contract. copy and keep this for future use

### Give Right To Vote

we need to give voting rights to an account before a vote transaction can be sent. rights can only be given by the person who deployed the contract

if you are interacting with an existing contract, send your address in a message to get it approved

if you deployed your own contract you can use the command below to approve another address to vote

paste the command into the terminal. replace CONTRACT_ADDRESS with the address you got from the deployment step. NEW_VOTER_ADDRESS is the wallet address you want to approve to vote

- yarn run ts-node --files ./scripts/GiveRightToVote.ts CONTRACT_ADDRESS NEW_VOTER_ADDRESS

### Delegate Vote

this will give your voting power to another address. for this to work, your address and the address you want to delegate to must both have been given permission to vote

run the command in the terminal replacing CONTRACT_ADDRESS with the onchain ballot address and NEW_DELEGATE_ADDRESS with the wallet address you want to give your voting power to

- yarn run ts-node --files ./scripts/Delegate.ts CONTRACT_ADDRESS NEW_DELEGATE_ADDRESS

### Get Ballot Results

query the ballot contract to find out which proposal is winning and how many votes it has

run the command in the terminal replacing CONTRACT_ADDRESS with ballot contract address on goerli network

- yarn run ts-node --files ./scripts/Results.ts CONTRACT_ADDRESS

### Vote

after your account/address has been given voting rights you may vote on a proposal

run the command in the terminal replacing CONTRACT_ADDRESS with ballot contract address and VOTE with the index of the proposal you want to vote for(1, 2, 3...).

Proposal Index is zero based so to vote for Proposal 1 you would pass in 0. Proposal2 can be voted for by passing in 1, etc

- yarn run ts-node --files ./scripts/Vote.ts CONTRACT_ADDRESS VOTE

#### Notes

A ballot contract has already been deployed to goerli. The address is:
0xCC7A912deeCD9633D5019e158c1e3a99e955CfD1

It has Proposals:

- Proposal N. 1: Spring
- Proposal N. 2: Summer
- Proposal N. 3: Fall
- Proposal N. 4: Winter

Feel free to interact with it using the contract address and the scripts above. Paste your wallet address in the chat and I will give you voting rights.

If you want to try multiple accounts to vote more than once, or to try the delegate function then do the following:

In your metamask, create a new account.

AGAIN THIS ACCOUNT WILL ONLY BE FOR CODING AND SHOULD NEVER HAVE REAL FUNDS IN IT

That said, all of your accounts will need some goerli ether to use these scripts and interact with the contract

Export the private key of your new account and paste that in your .env where the private key for your original account was

You can do this to interact with the contract using multiple accounts(say if your first account is authorized to vote but you want to attempt to vote with a second account to see that the transaction will fail. or maybe you want to get 2 accounts able to vote then delegate the vote from account1 to account2)
