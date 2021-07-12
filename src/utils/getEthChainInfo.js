export const getEthChainInfo = () => {
  // let chainId = 42;
  // let rpcUrl = 'https://kovan.infura.io/v3/cb76dcac4ae3402fb421b2b0d4c28db3/';
  let chainId = 1;
  let rpcUrl = 'https://mainnet.infura.io/v3/cb76dcac4ae3402fb421b2b0d4c28db3/';
  // // if (/\/\/farm.deor.io/.test(href)) {
  //      chainId = 1;
  //      rpcUrl = 'https://mainnet.infura.io/v3/e707b58edfd7437cbb6e9079c259eda7/';
  //      ethscanType = '';
  // // }
  return {
    chainId,
    rpcUrl,
  }
};
