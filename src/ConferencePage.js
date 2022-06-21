import React, { useState } from "react";
import { ConferenceContextProvider, useConference } from "./ConferenceContext";
import { WalletSection } from './Components/WalletSection';

export const ConferencePage = () => {
  const { loading } = useConference();
  const [groupAddresses, setGroupAddresses] = useState(["", "", "", ""]);

  const handleSingleTicketMint = async () => {

  };

  const handleGroupTicketMint = async () => {

  }

  const handleAddressChange = (value, i) => {
    const newAddresses = groupAddresses.map((addr, idx) => {
      if (idx === i) {
        return value;
      }
      return addr;
    });
    setGroupAddresses(newAddresses);
  }

  return (
    <ConferenceContextProvider>
      <div className="App">
        <header className="App-header">
          <WalletSection />
          <div>
            {!loading ? (
              <div>
                <button onClick={handleSingleTicketMint}>Mint Single Ticket</button>
                <br />
                {groupAddresses.map((addr, i) => (
                  <input
                    type="text"
                    value={addr}
                    placeholder={`Address ${i + 1}`}
                    onChange={e => handleAddressChange(e.target.value, i)} />
                ))}
                <button onClick={handleGroupTicketMint}>Mint Group Ticket</button>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </header>
      </div>
    </ConferenceContextProvider>
  )
}