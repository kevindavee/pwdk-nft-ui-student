import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

function App() {
  const [provider, setProvider] = useState();

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
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
