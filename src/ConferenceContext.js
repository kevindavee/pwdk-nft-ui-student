import React from "react";

const ConferenceContext = React.createContext({});

export const ConferenceContextProvider = ({ children }) => {
  const contextValue = {};

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
