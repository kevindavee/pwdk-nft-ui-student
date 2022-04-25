import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

function App() {
  const [provider, setProvider] = useState();
  const [address, setWalletAddress] = useState('');

  useEffect(() => {
    const checkConnectedWallet = async () => {
      const signer = provider.getSigner();
      try {
        const address = await signer.getAddress();
        setWalletAddress(address);
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

    if (provider) {
      checkConnectedWallet();
      listenToWalletAddressChange();
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
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {address
          ? <p>{address}</p>
          : <button onClick={connectToWallet}>
            Connect to Metamask
          </button>
        }
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
