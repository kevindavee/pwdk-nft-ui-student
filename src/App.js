import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';
import { web3Config } from './config';

function App() {
  const [provider, setProvider] = useState();
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
    }

    initProvider();
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

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={connectToWallet}>
          Connect to Metamask
        </button>
        {address ? (
          <div>
            <p>Connected to wallet: {address.substring(0, 5)}...{address.slice(address.length - 4)}</p>
            <button onClick={switchToNetwork}>
                Connect to {web3Config.chainName}
            </button>
          </div>
        ) : (
          <button onClick={connectToWallet}>
            Connect to Metamask
          </button>
        )}
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
