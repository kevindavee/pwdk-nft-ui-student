import React from "react";

export const TokenResult = ({ result, address }) => {
  if (!result) {
    return null;
  }

  return (
    <div>
      {result.tokenIds.map(tokenId => (
        <>
          <a key={tokenId} href={`https://testnets.opensea.io/assets/mumbai/${address}/${tokenId}`} target="__blank">View token #{tokenId} in OpenSea</a>
          <br />
        </>
      ))}
      <br />
      <a href={`https://mumbai.polygonscan.com/tx/${result.transactionHash}`} target="__blank">View on Polygon Scan</a>
    </div>
  )
}