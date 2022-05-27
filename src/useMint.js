import { ethers } from 'ethers';
import { useCallback, useState } from 'react';
import { useContract } from './ContractContext';
import { useWallet } from './WalletContext';

export const useMint = () => {
  const { contract } = useContract();
  const { address } = useWallet();
  const getContract = useCallback(contract, [contract]);
  
  const [loading, setLoading] = useState(false);

  const mint = async () => {
    try {
      const signContract = getContract('signing');
      setLoading(true);
      const tx = await signContract.mint({
        value: ethers.utils.parseEther("0.01")
      });
      const receipt = await tx.wait();
      const tokens = await signContract.tokensOfOwner(address);
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