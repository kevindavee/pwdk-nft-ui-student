import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";
import { useWallet } from './WalletContext';
import { web3Config } from './config';
import Abi from './abis/conference.json';

const ConferenceContext = React.createContext({});

export const ConferenceContextProvider = ({ children }) => {
  const { provider, rpcProvider, address } = useWallet();
  const [contract, setContract] = useState(null);
  const [readContract, setReadContract] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rpcProvider) {
      const { conferenceContractAddress } = web3Config;
      setReadContract(new ethers.Contract(
        conferenceContractAddress, Abi, rpcProvider
      ));
    }
  }, [rpcProvider]);

  useEffect(() => {
    if (provider) {
      const { conferenceContractAddress } = web3Config;
      setContract(new ethers.Contract(
        conferenceContractAddress, Abi, provider.getSigner()
      ));
    }
  }, [provider]);

  const mintIndividualTicket = async () => {
    try {
      setLoading(true);
      const tx = await contract.mintTicket();
      const receipt = await tx.wait();

      const tokens = readContract.tokensOfOwner(address);
      setLoading(false);
      return {
        tokenIds: tokens
          .slice(Math.max(tokens.length - 1, 0))
          .map((t) => t.toNumber()),
        transactionHash: receipt.transactionHash
      };
    } catch (e) {
      setLoading(false);
      console.error(e.message);
      return;
    }
  }

  const contextValue = {
    contract: (purpose) => purpose === 'signing' ? contract : readContract,
    mintIndividualTicket,
  };

  return (
    <ConferenceContext.Provider value={contextValue}>
      {children}
    </ConferenceContext.Provider>
  );
};

export const useConference = () => {
  const context = React.useContext(ConferenceContext);
  if (!context) {
    throw new Error("This hook must be used inside a ConferenceContextProvider")
  }

  return context;
}
