import React, { useState, useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { web3Config } from './config';

const WalletContext = React.createContext({});

export const WalletProvider = ({ children }) => {
  const [provider, setProvider] = useState();
  const [rpcProvider, setRpcProvider] = useState();
  const [address, setWalletAddress] = useState('');
  const [chainId, setChainId] = useState(0);

  useEffect(() => {
    const checkConnectedWallet = async () => {
      const signer = provider.getSigner();
      try {
        const address = await signer.getAddress();
        setWalletAddress(address);
        const ethProvider = await detectEthereumProvider();
        setChainId(Number(ethProvider.networkVersion));
      } catch (e) {
        console.error(e.message);
      }
    }

    const listenToWalletAddressChange = async () => {
      const ethProvider = await detectEthereumProvider();
      ethProvider.on('accountsChanged', (accounts) => {
        setWalletAddress(accounts[0]);
      });
    }

    const listenToNetworkChange = async () => {
      const ethProvider = await detectEthereumProvider();
      ethProvider.on('chainChanged', (networkId) => {
        setChainId(Number(networkId));
      });
    }

    if (provider) {
      checkConnectedWallet();
      listenToWalletAddressChange();
      listenToNetworkChange();
    }
  }, [provider]);

  useEffect(() => {
    const initProvider = async () => {
      const ethProvider = await detectEthereumProvider();
      if (!ethProvider) {
        console.error('Metamask is not installed');
        return;
      }
      const provider = new ethers.providers.Web3Provider(ethProvider);
      setProvider(provider);
    };

    const initRpcProvider = () => {
      const provider = new ethers.providers.JsonRpcProvider(web3Config.rpcUrl);
      setRpcProvider(provider);
    }

    initProvider();
    initRpcProvider();
  }, []);

  const connectToWallet = async () => {
    try {
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
    } catch (e) {
      console.error(e.message);
    }
  };

  const switchToNetwork = async () => {
    const { chainId } = web3Config;
  
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId}`}],
      })
    } catch (e) {
      console.error(e.message);
    }
  };

  const contextValue = {
    address,
    provider,
    rpcProvider,
    switchToNetwork,
    connectToWallet,
    chainId,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  )
};

export const useWallet = () => {
  const context = React.useContext(WalletContext);
  if (!context) {
    throw new Error("This hook must be used inside a WalletContextProvider");
  }
  return context;
};