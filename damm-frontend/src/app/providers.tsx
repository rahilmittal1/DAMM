'use client';

import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import * as React from 'react';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // <-- Add this
import { chains, config } from '../wagmi';

// Create a client
const queryClient = new QueryClient(); // <-- Add this

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}> {/* Wrap with this */}
        <RainbowKitProvider chains={chains}>
          {mounted && children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}