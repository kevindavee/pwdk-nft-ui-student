import React from "react";
import { useWallet } from '../WalletContext';
import { web3Config } from '../config';

export const WalletSection = () => {
  const {
    address,
    switchToNetwork,
    connectToWallet,
    chainId
  } = useWallet();

  return (
    address ? (
      <div>
        <p>Connected to wallet: {address.substring(0, 5)}...{address.slice(address.length - 4)}</p>
        {chainId !== web3Config.chainId && (
          <button onClick={switchToNetwork}>
              Connect to {web3Config.chainName}
          </button>
        )}
      </div>
    ) : (
      <button onClick={connectToWallet}>
        Connect to Metamask
      </button>
    )
  );
}