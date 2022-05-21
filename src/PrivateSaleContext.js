import React, { useCallback, useEffect, useState } from 'react';
import { useContract } from './ContractContext';
import { useWallet } from './WalletContext';

const PrivateSaleContext = React.createContext({});

export const PrivateSaleProvider = ({ children }) => {
  const { contract } = useContract();
  const getContract = useCallback(contract, [contract]);

  const { address } = useWallet();
  const [loading, setLoading] = useState();
  const [privateSaleStart, setPrivateSaleStart] = useState();


  useEffect(() => {
    const initPrivateSale = async () => {
      setLoading(true);
      const readContract = getContract();
      if (readContract && address) {
        const [privStartTimestamp] = await Promise.all([
          readContract.privateSaleStartTimestamp()
        ]);

        setPrivateSaleStart(new Date(privStartTimestamp.toNumber() * 1000));
      }
      setLoading(false);
    };

    initPrivateSale();
  }, [getContract, address]);

  const contextValue = {
    privateSaleStart,
    loading
  };

  return (
    <PrivateSaleContext.Provider value={contextValue}>
      {children}
    </PrivateSaleContext.Provider>
  );
}

export const usePrivateSale = () => {
  const context = React.useContext(PrivateSaleContext);
  if (!context) {
    throw new Error("This hook must be used inside a PrivateSaleContextProvider");
  }
  return context;
};