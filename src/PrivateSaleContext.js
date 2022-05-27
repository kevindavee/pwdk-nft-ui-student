import React, { useCallback, useEffect, useState } from 'react';
import { useContract } from './ContractContext';
import { useWallet } from './WalletContext';
import { ethers } from 'ethers';

const PrivateSaleContext = React.createContext({});

export const PrivateSaleProvider = ({ children }) => {
  const { contract } = useContract();
  const getContract = useCallback(contract, [contract]);

  const { address } = useWallet();
  const [loading, setLoading] = useState(true);
  const [privateSaleStart, setPrivateSaleStart] = useState();
  const [privateSaleEnd, setPrivateSaleEnd] = useState();
  const [mintQty, setMintQty] = useState(0);
  const [hasMinted, setHasMinted] = useState(false);
  const [isCurrentlyPrivSale, setIsCurrentlyPrivSale] = useState(false);
  const [privSalePrice, setPrice] = useState('');
  const isEligbleForPrivateMint = isCurrentlyPrivSale && mintQty && !hasMinted;

  const mint = async () => {
    if (!isEligbleForPrivateMint) {
      return null;
    }

    const signContract = getContract('signing');
    setLoading(true);
    const tx = await signContract.privateMint({
      value: ethers.utils.parseUnits(privSalePrice, 'wei').mul(mintQty)
    });
    const receipt = await tx.wait();
    const tokens = await signContract.tokensOfOwner(address);
    return {
      tokenIds: tokens[tokens.length - mintQty],
      transactionHash: receipt.transactionHash
    };
  }


  useEffect(() => {
    const initPrivateSale = async () => {
      const readContract = getContract();
      if (readContract && address) {
        setLoading(true);
        const [privStartTimestamp, privEndTimestamp, mintQtyResult, doneMintingResult, price] = await Promise.all([
          readContract.privateSaleStartTimestamp(),
          readContract.privateSaleEndTimestamp(),
          readContract.addressToMintQty(address),
          readContract.addressToDoneMinting(address),
          readContract.PRIVATE_SALE_PRICE()
        ]);
        const now = new Date().getTime() / 1000;

        setPrivateSaleStart(new Date(privStartTimestamp.toNumber() * 1000));
        setPrivateSaleEnd(new Date(privEndTimestamp.toNumber() * 1000));
        setMintQty(mintQtyResult.toNumber());
        setHasMinted(doneMintingResult);
        setIsCurrentlyPrivSale(privStartTimestamp <= now && now <= privEndTimestamp);
        setPrice(price.toString());
        setLoading(false);
      }
    };

    initPrivateSale();
  }, [getContract, address]);

  const contextValue = {
    privateSaleStart,
    privateSaleEnd,
    mintQty,
    hasMinted,
    loading,
    isCurrentlyPrivSale,
    privSalePrice,
    isEligbleForPrivateMint,
    mint
  };

  return (
    <PrivateSaleContext.Provider value={contextValue}>
      {children}
    </PrivateSaleContext.Provider>
  );
}

export const usePrivateSale = () => {
  const context = React.useContext(PrivateSaleContext);
  if (!context) {
    throw new Error("This hook must be used inside a PrivateSaleContextProvider");
  }
  return context;
};