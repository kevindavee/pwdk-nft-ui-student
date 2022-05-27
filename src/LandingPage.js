import logo from './logo.svg';
import './App.css';
import { web3Config } from './config';
import { useWallet } from './WalletContext';
import { usePrivateSale } from './PrivateSaleContext';
import { useCallback, useEffect, useState } from 'react';

export function LandingPage() {
  const [canMint, setCanMint] = useState(false);
  const [message, setMessage] = useState('');

  const {
    provider,
    rpcProvider,
    address,
    switchToNetwork,
    connectToWallet,
    chainId
  } = useWallet();

  const {
    privateSaleStart,
    privateSaleEnd,
    mintQty,
    hasMinted,
    isCurrentlyPrivSale,
    loading
  } = usePrivateSale();

  const getMessage = useCallback(() => {
    const now = new Date();

    if (now < privateSaleStart) {
      setMessage(`Comeback during private sale on ${privateSaleStart}`);
    } else if (isCurrentlyPrivSale && !mintQty) {
      setMessage(`You are not eligble for private sale minting. Comeback on public sale after: ${privateSaleEnd}`);
    } else if (isCurrentlyPrivSale && mintQty && hasMinted) {
      setMessage(`You already minted during private sale. Comeback on public sale: ${privateSaleEnd}`);
    }
  }, [hasMinted, isCurrentlyPrivSale, mintQty, privateSaleEnd, privateSaleStart]);

  useEffect(() => {
    if (!loading && address) {
      const now = new Date();

      const shouldMintOnPrivSale = isCurrentlyPrivSale && mintQty && !hasMinted;
      const shouldMintOnPublicSale = !isCurrentlyPrivSale && now > privateSaleEnd;

      if (shouldMintOnPrivSale || shouldMintOnPublicSale) {
        // navigate to mint screen
      } else {
        setCanMint(false);
        getMessage();
      }
    }
  }, [
    loading,
    address,
    isCurrentlyPrivSale,
    mintQty,
    hasMinted,
    getMessage,
    privateSaleEnd
  ]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
        {loading && address && (
          <p>Loading information...</p>
        )}
        {!canMint && !loading && message && (
          <p>{message}</p>
        )}
        {canMint && !loading && (
          <button>Mint</button>
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
