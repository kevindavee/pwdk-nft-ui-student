import React, { useEffect, useState } from 'react';
import { useWallet } from './WalletContext';
import { useContract } from './ContractContext';

const AirdropContext = React.createContext({});

export const AirdropProvider = ({ children }) => {
  const { contract: getContract } = useContract();
  const { address } = useWallet();
  const [allowed, setAllowed] = useState(false);
  const [received, setReceived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const initAirdrop = async () => {
      const contract = getContract();
      const [allowedForAirdrop, receivedAirdrop] = await Promise.all([
        contract.addressToAllowedAirdrop(address),
        contract.addressToReceivedAirdrop(address),
      ]);
      setAllowed(allowedForAirdrop);
      setReceived(receivedAirdrop);
      setLoading(false);
    }
    if (address) {
      initAirdrop();
    }
  }, [address, getContract]);

  const claimAirdrop = async () => {
    try {
      setClaiming(true);
      const signContract = getContract('signing');
      const tx = await signContract.claimAirdrop();
      const receipt = await tx.wait();
      const tokens = await signContract.tokensOfOwner(address);
      setClaiming(false);
      return {
        tokenIds: tokens
          .slice(Math.max(tokens.length - 1, 0))
          .map((t) => t.toNumber()),
        transactionHash: receipt.transactionHash
      };
    } catch (e) {
      setClaiming(false);
      console.error(e.message);
      throw e;
    }
  }

  const contextValue = {
    allowed,
    received,
    claimAirdrop,
    loading,
    claiming
  };

  return (
    <AirdropContext.Provider value={contextValue}>
      {children}
    </AirdropContext.Provider>
  );
};

export const useAirdrop = () => {
  const context = React.useContext(AirdropContext);
  if (!context) {
    throw new Error("This hook must be used inside a AirdropContextProvider");
  }
  return context;
};
