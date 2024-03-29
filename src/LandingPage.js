import logo from './logo.svg';
import './App.css';
import { web3Config } from './config';
import { useWallet } from './WalletContext';
import { usePrivateSale } from './PrivateSaleContext';
import { useCallback, useEffect, useState } from 'react';
import { useMint } from './useMint';
import { useAirdrop } from './AirdropContext';
import { WalletSection } from './Components/WalletSection';
import { TokenResult } from './Components/TokenResult';

export function LandingPage() {
  const [canMint, setCanMint] = useState(false);
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  const {
    address,
  } = useWallet();

  const {
    privateSaleStart,
    privateSaleEnd,
    mintQty,
    hasMinted,
    isCurrentlyPrivSale,
    loading
  } = usePrivateSale();

  const {
    allowed,
    received,
    loading: loadingAirdrop,
    claiming,
    claimAirdrop
  } = useAirdrop();

  const { mint, loading: minting } = useMint();

  const handleMintNft = async () => {
    const result = await mint();
    setResult(result);
  }

  const handleAirdrop = async () => {
    const result = await claimAirdrop();
    setResult(result);
  }

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
        setCanMint(true);
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
        <WalletSection />
        {loading && address && (
          <p>Loading information...</p>
        )}
        {!canMint && !loading && message && (
          <p>{message}</p>
        )}

        {/* Button for mint (priv or public sale) */}
        {!result && canMint && !loading && !minting && (
          <button onClick={handleMintNft}>Mint</button>
        )}

        {/* Button for claim airdrop */}
        {!loadingAirdrop && allowed && !received && (
          <button onClick={handleAirdrop}>
            Claim airdrop
          </button>
        )}
        {!result && canMint && !loading && (minting || claiming) && (
          <p>Minting NFT(s)...</p>
        )}
        <TokenResult result={result} address={web3Config.contractAddress} />
      </header>
    </div>
  );
}
