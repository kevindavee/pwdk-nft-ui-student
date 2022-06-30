import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useWallet } from './WalletContext';
import { useContract } from './ContractContext';
import { web3Config } from './config';
import Abi from './abis/conference.json';

const ConferenceContext = React.createContext({});

export const ConferenceContextProvider = ({ children }) => {
  const { provider, rpcProvider, address } = useWallet();
  const { contract: artContract } = useContract();
  const [contract, setContract] = useState(null);
  const [readContract, setReadContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signing, setSigning] = useState(false);

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

      const tokens = await readContract.tokensOfOwner(address);
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

  const mintGroupTicket = async (addresses) => {
    try {
      if (addresses.length !== 4) {
        throw Error("addresses must be length of 4");
      }
      setLoading(true);
      setSigning(true);
      const artSigningContract = artContract('signing');
      const [tokens, allowGroupPurchase] = await Promise.all([
        artSigningContract.tokensOfOwner(address),
        readContract.addressToAllowGroupPurchase(address)
      ]);
      if (!allowGroupPurchase) {
        const stringifiedTokens = JSON.stringify(tokens.map(t => t.toNumber()).join(','));
        const signer = provider.getSigner();
        const signatureData = await signer.signMessage(stringifiedTokens);
  
        const { data } = await axios.post(`${web3Config.verificationUrl}/verify`, {
          signature: signatureData,
          address,
        });
  
        const verifyTx = await contract.verify(stringifiedTokens, data.signature);
        await verifyTx.wait();
      }
      setSigning(false);

      const tx = await contract.mintGroupTicket(addresses);
      const receipt = await tx.wait();

      const result = await Promise.all([address, ...addresses].map(addr => readContract.tokensOfOwner(addr)));
      setLoading(false);
      return {
        tokenIds: result.map(tokensOfUser => tokensOfUser[0].toNumber()),
        transactionHash: receipt.transactionHash
      };
    } catch (e) {
      setSigning(false);
      setLoading(false);
      console.error(e.response && e.response.data ? e.response.data.message : e.message);
      return;
    }
  }

  const contextValue = {
    contract: (purpose) => purpose === 'signing' ? contract : readContract,
    mintIndividualTicket,
    mintGroupTicket,
    loading,
    signing,
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
