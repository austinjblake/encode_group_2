import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Chocolate", "Vanilla", "Lemon", "Cookie"];
function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

describe("Ballot", () => {
  let ballotContract: Ballot;
  let accounts: SignerWithAddress[];
  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const ballotContractFacotry = await ethers.getContractFactory("Ballot");
    ballotContract = (await ballotContractFacotry.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    )) as Ballot;
    await ballotContract.deployed();
  });
  describe("when the contract is deployed", () => {
    it("has the provided proposals", async () => {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.equal(
          PROPOSALS[index]
        );
      }
    });
    it("sets the deployer address as chairperson", async () => {
      const chairperson = await ballotContract.chairperson();
      expect(chairperson).to.equal(accounts[0].address);
      console.log(chairperson, accounts[0].address);
    });
    it("sets the voting weight for the chairperson to 1", async () => {
      const chairpersonVoter = await ballotContract.voters(accounts[0].address);
      expect(chairpersonVoter.weight).to.equal(1);
    });
  });
  describe("when the chairperson interacts with the giveRightToVote function in the contract", () => {
    beforeEach(async () => {
      const selectedVoter = accounts[1].address;
      const tx = await ballotContract.giveRightToVote(selectedVoter);
      await tx.wait();
    });
    it("gives right to vote for another address", async () => {
      const acc1Voter = await ballotContract.voters(accounts[1].address);
      expect(acc1Voter.weight).to.eq(1);
    });
    it("can not give right to vote for someone that has voted", async () => {
      const tx = await ballotContract.connect(accounts[1]).vote(0);
      await tx.wait();
      await expect(
        ballotContract.giveRightToVote(accounts[1].address)
      ).to.be.revertedWith("The voter already voted.");
    });
    it("can not give right to vote for someone that has already voting rights", async () => {
      const selectedVoter = accounts[1].address;
      await expect(
        ballotContract.giveRightToVote(selectedVoter)
      ).to.be.revertedWithoutReason();
    });
  });

  describe("when the voter interact with the vote function in the contract", function () {
    it("should register the vote", async () => {
      const selectedVoter = accounts[1];
      const tx = await ballotContract.giveRightToVote(selectedVoter.address);
      await tx.wait();
      const chosenProposalIndex = 1;
      const vote = await ballotContract
        .connect(selectedVoter)
        .vote(chosenProposalIndex);
      await vote.wait();
      const chosenProposal = await ballotContract.proposals(
        chosenProposalIndex
      );
      const proposalVotes = chosenProposal.voteCount;
      expect(proposalVotes).to.equal(1);
      const voterRecord = await ballotContract.voters(selectedVoter.address);
      expect(voterRecord.vote).to.equal(chosenProposalIndex);
      expect(voterRecord.voted).to.equal(true);
    });
  });

  describe("when the voter interact with the delegate function in the contract", function () {
    it("should transfer voting power", async () => {
      const selectedVoter = accounts[1];
      const tx = await ballotContract.giveRightToVote(selectedVoter.address);
      await tx.wait();
      const delegatedAddress = accounts[2].address;
      const tx2 = await ballotContract.giveRightToVote(delegatedAddress);
      await tx2.wait();
      const transferPower = await ballotContract
        .connect(selectedVoter)
        .delegate(delegatedAddress);
      await transferPower.wait();
      const delegatedVoter = await ballotContract.voters(delegatedAddress);
      expect(delegatedVoter.weight).to.equal(2);
      const ogVoter = await ballotContract.voters(selectedVoter.address);
      expect(ogVoter.voted).to.equal(true);
      expect(ogVoter.delegate).to.equal(delegatedAddress);
    });
  });

  describe("when the an attacker interact with the giveRightToVote function in the contract", function () {
    it("should revert", async () => {
      const attacker = accounts[6];
      await expect(
        ballotContract.connect(attacker).giveRightToVote(accounts[6].address)
      ).to.be.revertedWith("Only chairperson can give right to vote.");
    });
  });

  describe("when the an attacker interact with the vote function in the contract", function () {
    it("should revert", async () => {
      const attacker = accounts[6];
      await expect(ballotContract.connect(attacker).vote(0)).to.be.revertedWith(
        "Has no right to vote"
      );
    });
  });

  describe("when the an attacker interact with the delegate function in the contract", function () {
    it("should revert", async () => {
      const attacker = accounts[6];
      await expect(
        ballotContract.connect(attacker).delegate(accounts[5].address)
      ).to.be.revertedWith("You have no right to vote");
    });
  });

  describe("when someone interact with the winningProposal function before any votes are cast", function () {
    it("should return 0", async () => {
      const proposal = await ballotContract.winningProposal();
      expect(proposal).to.equal(0);
    });
  });

  describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
    it("should return 0", async () => {
      await ballotContract.vote(0);
      const proposal = await ballotContract.winningProposal();
      expect(proposal).to.equal(0);
    });
  });

  describe("when someone interact with the winnerName function before any votes are cast", function () {
    it("should return name of proposal 0", async () => {
      const prop0 = await ballotContract.proposals(0);
      const winningName = await ballotContract.winnerName();
      expect(winningName).to.equal(prop0.name);
    });
  });

  describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
    it("should return name of proposal 0", async () => {
      await ballotContract.vote(0);
      const prop0 = await ballotContract.proposals(0);
      const winningName = await ballotContract.winnerName();
      expect(winningName).to.equal(prop0.name);
    });
  });

  describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
    it("should return the name of the winner proposal", async () => {
      for (let i = 1; i < 5; i++) {
        const approve = await ballotContract.giveRightToVote(
          accounts[i].address
        );
        await approve.wait();
      }
      await Promise.all([
        ballotContract.vote(1),
        ballotContract.connect(accounts[1]).vote(3),
        ballotContract.connect(accounts[2]).vote(0),
        ballotContract.connect(accounts[3]).vote(3),
        ballotContract.connect(accounts[4]).vote(2),
      ]);
      const winningProp = await ballotContract.winningProposal();
      const winningName = await ballotContract.winnerName();
      const prop3 = await ballotContract.proposals(3);
      expect(winningName).to.equal(prop3.name);
      expect(winningProp).to.equal(3);
      expect(prop3.voteCount).to.equal(2);
    });
  });
});
