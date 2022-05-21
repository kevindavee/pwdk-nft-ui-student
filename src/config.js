export const web3Config = {
    chainId: Number(process.env.REACT_APP_CHAIN_ID),
    chainName: process.env.REACT_APP_CHAIN_NAME,
    rpcUrl: process.env.REACT_APP_RPC_URL,
    contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
    conferenceContractAddress: process.env.REACT_APP_CONFERENCE_CONTRACT_ADDRESS,
}