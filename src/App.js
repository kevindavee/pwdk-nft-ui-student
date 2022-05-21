import logo from './logo.svg';
import './App.css';
import { web3Config } from './config';
import { useWallet } from './WalletContext';

function App() {
  const {
    provider,
    rpcProvider,
    address,
    switchToNetwork,
    connectToWallet,
    chainId
  } = useWallet();

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
            {chainId !== web3Config.chainId && (
              <button onClick={switchToNetwork}>
                  Connect to {web3Config.chainName}
              </button>
            )}
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
