import { expect } from "chai";
import { ethers } from "hardhat";
import { DAMM__factory } from "../typechain-types/factories/contracts/DAMM__factory";
import { DAMM } from "../typechain-types/contracts/DAMM";

describe("DAMM", () => {
  let damm: DAMM;
  const ETH = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
  const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  beforeEach(async () => {
    const DAMMFactory = await ethers.getContractFactory("DAMM");
    damm = (await DAMMFactory.deploy()) as unknown as DAMM;
    await damm.waitForDeployment();
  });

  it("Should create a pool", async () => {
    await damm.createPool([ETH, USDC], 30);
    const tokens = await damm.getPoolTokens(0);
    expect(tokens).to.deep.equal([ETH, USDC]);
  });

  it("Should swap ETH for USDC", async () => {
    await damm.createPool([ETH, USDC], 30);
    await damm.addLiquidity(0, [
      ethers.parseEther("10"), 
      ethers.parseUnits("20000", 6)
    ]);

    const amountIn = ethers.parseEther("1");
    await damm.swap(0, ETH, USDC, amountIn);

    const reserveEth = await damm.getReserve(0, ETH);
    expect(reserveEth).to.equal(ethers.parseEther("11"));
  });
});