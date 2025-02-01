import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { zkSync } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { createPublicClient, http } from 'viem';

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

// Configure chains and providers
const { chains, publicClient } = configureChains(
  [zkSync],
  [publicProvider()]
);

// Set up RainbowKit wallets
const { connectors } = getDefaultWallets({
  appName: 'DAMM',
  projectId: walletConnectProjectId,
  chains
});

// Create wagmi config
export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

// Export public client for direct use
export const viemPublicClient = createPublicClient({
  chain: zkSync,
  transport: http()
});

export {chains}