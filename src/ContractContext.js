import React from 'react';

const ContractContext = React.createContext({});

export const ContractContextProvider = ({ children }) => {
    
};

export const useContract = () => {
    const context = React.useContext(ContractContext);
  if (!context) {
    throw new Error("This hook must be used inside a ContractContextProvider");
  }
  return context;
};
