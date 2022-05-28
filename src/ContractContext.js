import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { web3Config } from './config';
import Abi from './abi.json';
import { useWallet } from './WalletContext';

const ContractContext = React.createContext({});

export const ContractProvider = ({ children }) => {
  const { provider, rpcProvider } = useWallet();
  const [contract, setContract] = useState(null);
  const [readContract, setReadContract] = useState(null);

  useEffect(() => {
    if (rpcProvider) {
      const { contractAddress } = web3Config;
      setReadContract(new ethers.Contract(
        contractAddress, Abi, rpcProvider
      ));
    }
  }, [rpcProvider]);

  useEffect(() => {
    if (provider) {
      const { contractAddress } = web3Config;
      setContract(new ethers.Contract(
        contractAddress, Abi, provider.getSigner()
      ));
    }
  }, [provider]);

  const contextValue = {
    contract: (purpose) => purpose === 'signing' ? contract : readContract,
  };

  return (
    <ContractContext.Provider value={contextValue}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
    const context = React.useContext(ContractContext);
  if (!context) {
    throw new Error("This hook must be used inside a ContractContextProvider");
  }
  return context;
};
