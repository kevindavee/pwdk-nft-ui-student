import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";
import { useWallet } from './WalletContext';
import { web3Config } from './config';
import Abi from './abis/conference.json';

const ConferenceContext = React.createContext({});

export const ConferenceContextProvider = ({ children }) => {
  const { provider, rpcProvider } = useWallet();
  const [contract, setContract] = useState(null);
  const [readContract, setReadContract] = useState(null);

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

  const contextValue = {
    contract: (purpose) => purpose === 'signing' ? contract : readContract,
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
