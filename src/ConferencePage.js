import React, { useState } from "react";
import { ConferenceContextProvider, useConference } from "./ConferenceContext";
import { WalletSection } from './Components/WalletSection';
import { TokenResult } from "./Components/TokenResult";
import { web3Config } from "./config";

const ConferencePageInner = () => {
  const {
    loading,
    signing,
    mintIndividualTicket,
    mintGroupTicket
  } = useConference();
  const [groupAddresses, setGroupAddresses] = useState(["", "", "", ""]);
  const [result, setResult] = useState(null);

  const handleSingleTicketMint = async () => {
    const res = await mintIndividualTicket();
    setResult(res);
  };

  const handleGroupTicketMint = async () => {
    const res = await mintGroupTicket(groupAddresses);
    setResult(res);
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
    <div className="App">
      <header className="App-header">
        <WalletSection />
        <div>
          {!loading && !signing && !result && (
            <div>
              <button onClick={handleSingleTicketMint}>Mint Single Ticket</button>
              <br />
              <br />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {groupAddresses.map((addr, i) => (
                  <input
                    key={`Address_${i + 1}`}
                    type="text"
                    value={addr}
                    placeholder={`Address ${i + 1}`}
                    onChange={e => handleAddressChange(e.target.value, i)}
                    style={{ marginBottom: 10 }}
                  />
                ))}
                <button onClick={handleGroupTicketMint}>Mint Group Ticket</button>
              </div>
            </div>
          )}
          {signing && loading && !result && (
            <p>Signing your transaction...</p>
          )}
          {!signing && loading && !result && (
            <p>Minting your NFT(s)</p>
          )}
          <TokenResult result={result} address={web3Config.conferenceContractAddress} />
        </div>
      </header>
    </div>
  )
};

export const ConferencePage = () => {
  return (
    <ConferenceContextProvider>
      <ConferencePageInner />
    </ConferenceContextProvider>
  )
}