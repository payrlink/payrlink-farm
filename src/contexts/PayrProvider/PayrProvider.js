import React, { createContext, useEffect, useState } from 'react';

import { useWallet } from 'use-wallet';

import { PAYR } from '../../contracts';

export const Context = createContext({
  payr: undefined,
});

const PayrProvider = ({ children }) => {
  const { ethereum } = useWallet();
  const [payr, setPayr] = useState();

  window.payr = payr;
  window.eth = ethereum;

  useEffect(() => {
    if (ethereum) {
      const chainId = Number(ethereum.chainId);
      const payrLib = new PAYR(ethereum, chainId, false, {
        defaultAccount: ethereum.selectedAddress,
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: '6000000',
        defaultGasPrice: '1000000000000',
        accounts: [],
        ethereumNodeTimeout: 10000,
      });
      setPayr(payrLib);
      window.payrsauce = payrLib;
    }
  }, [ethereum]);

  return <Context.Provider value={{ payr }}>{children}</Context.Provider>
}

export default PayrProvider;
