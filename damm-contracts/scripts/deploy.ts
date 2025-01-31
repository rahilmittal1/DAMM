// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  // Get the contract factory
  const DAMM = await ethers.getContractFactory("DAMM");
  
  // Deploy the contract
  const damm = await DAMM.deploy();
  
  // Wait for deployment to complete
  await damm.waitForDeployment();
  
  // Log the deployed address
  console.log("DAMM deployed to:", await damm.getAddress());
}

// Execute and catch errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});