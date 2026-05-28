/// <reference types="vite/client" />
import React, { createContext, useContext, useState, useEffect } from "react";

export type Network = "testnet" | "mainnet";

interface NetworkContextType {
  network: Network;
  setNetwork: (n: Network) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

const ENV_NETWORK = (import.meta.env.VITE_STELLAR_NETWORK as string | undefined)?.toLowerCase();
const INITIAL_NETWORK: Network =
  localStorage.getItem("srs_network") === "mainnet"
    ? "mainnet"
    : localStorage.getItem("srs_network") === "testnet"
    ? "testnet"
    : ENV_NETWORK === "mainnet"
    ? "mainnet"
    : "testnet";

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [network, setNetworkState] = useState<Network>(INITIAL_NETWORK);

  useEffect(() => {
    localStorage.setItem("srs_network", network);
  }, [network]);

  function setNetwork(n: Network) {
    setNetworkState(n);
  }

  return (
    <NetworkContext.Provider value={{ network, setNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = (): NetworkContextType => {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
};
