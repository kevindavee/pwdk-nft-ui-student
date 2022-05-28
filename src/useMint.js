import { useCallback, useState } from 'react';
import { useContract } from './ContractContext';
import { usePrivateSale } from './PrivateSaleContext';
import { useWallet } from './WalletContext';

export const useMint = () => {
  const { contract } = useContract();
  const { address } = useWallet();
  const getContract = useCallback(contract, [contract]);
  
  const [loading, setLoading] = useState(false);
  const { mint: privateMint } = usePrivateSale();

  const mint = async () => {
    try {
      const privMintResult = await privateMint();
      // Return private mint result as result.
      // Null means not eligible for private mint and shall continue with public minting
      if (privMintResult) {
        return privMintResult;
      }

      const signContract = getContract('signing');
      const price = await signContract.PRICE();
      setLoading(true);
      const tx = await signContract.mint({
        value: price
      });
      const receipt = await tx.wait();
      const tokens = await signContract.tokensOfOwner(address);
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
      throw e;
    }
  };

  return {
    mint,
    loading
  };
};