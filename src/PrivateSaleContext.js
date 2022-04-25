import React from 'react';

const PrivateSaleContext = React.createContext({});

export const PrivateSaleContextProvider = ({ children }) => {
  const contextValue = {

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