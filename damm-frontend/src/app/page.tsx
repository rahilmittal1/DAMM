"use client";

import { useAccount, useContractRead } from "wagmi";
import { DAMM_ADDRESS } from "../constants/addresses";
import { DAMM_ABI } from "../constants/abi";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import { viemPublicClient } from "../wagmi";

type PoolData = {
  tokens: string[];
  fee: number;
};

export default function Home() {
  const { address } = useAccount();
  const [pools, setPools] = useState<PoolData[]>([]);
  const [loading, setLoading] = useState(true);

  // Get total number of pools
  const { data: poolCount } = useContractRead({
    address: DAMM_ADDRESS,
    abi: DAMM_ABI,
    functionName: "getPoolCount",
  });

  // Fetch all pools
  useEffect(() => {
    const fetchPools = async () => {
      if (!poolCount) return;

      setLoading(true);
      try {
        const poolPromises = [];
        for (let i = 0; i < Number(poolCount); i++) {
          poolPromises.push(
            viemPublicClient.readContract({
              address: DAMM_ADDRESS,
              abi: DAMM_ABI,
              functionName: "getPoolById",
              args: [BigInt(i)],
            })
          );
        }

        const poolResults = await Promise.all(poolPromises);
        const formattedPools = poolResults.map((pool: any) => ({
          tokens: pool[0],
          fee: Number(pool[1]) / 10 // Convert from basis points
        }));

        setPools(formattedPools);
      } catch (error) {
        console.error("Error fetching pools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPools();
  }, [poolCount]);

  return (
    <main className="min-h-screen p-24">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">DAMM 💧💉</h1>
          <ConnectButton />
        </div>

        {/* Pool List */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Liquidity Pools</h2>
          
          {loading ? (
            <div className="text-center py-4">Loading pools...</div>
          ) : pools.length === 0 ? (
            <div className="text-center py-4">No pools created yet</div>
          ) : (
            pools.map((pool, index) => (
              <div key={index} className="p-4 border-b last:border-0">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    Pool #{index}: {pool.tokens.join(" / ")}
                  </span>
                  <span className="text-gray-600">{pool.fee}% fee</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}