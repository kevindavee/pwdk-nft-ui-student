import React from 'react';

const ContractContext = React.createContext({});

export const ContractContextProvider = ({ children }) => {
    const contextValue = {

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
