import { useState } from "react";

interface Props {
  walletAddress: string | null;
  onConnect: (address: string | null) => void;
}

// Freighter injects window.freighter at runtime — no official type package available,
// so we use type assertions with explicit comments rather than @ts-ignore.
declare global {
  interface Window {
    freighter?: {
      requestAccess: () => Promise<{ address: string }>;
      getAddress: () => Promise<{ address: string }>;
    };
  }
}

export default function WalletConnect({ walletAddress, onConnect }: Props) {
  const [error, setError] = useState("");
  const [freighterMissing, setFreighterMissing] = useState(false);

  async function connect() {
    setError("");
    setFreighterMissing(false);

    // Check at call-time, not render-time, so the extension has time to inject
    if (!window.freighter) {
      setFreighterMissing(true);
      return;
    }

    try {
      const { address: addr } = await window.freighter.requestAccess();
      onConnect(addr);
    } catch {
      setError("Connection rejected. Please approve the request in Freighter.");
    }
  }

  function disconnect() {
    setFreighterMissing(false);
    setError("");
    onConnect(null);
    localStorage.removeItem("lastWalletAddress");
  }

  return (
    <div className="card">
      <div className="wallet-row">
        <span className="badge">Wallet</span>
        {walletAddress ? (
          <>
            <span className="wallet-addr">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
            <button className="btn-secondary" onClick={disconnect}>
              Disconnect
            </button>
          </>
        ) : (
          <button className="btn-primary" onClick={connect}>
            Connect Freighter
          </button>
        )}
      </div>

      {freighterMissing && (
        <div className="status error">
          Freighter wallet not found. Install it at{" "}
          <a
            href="https://freighter.app"
            target="_blank"
            rel="noreferrer"
            className="freighter-link"
          >
            freighter.app
          </a>
        </div>
      )}

      {error && <div className="status error">{error}</div>}
    </div>
  );
}
