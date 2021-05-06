import { useCallback, useEffect, useState } from 'react';
import { useWallet } from 'use-wallet';

import {
  getFarmContract,
  getWethContract,
  getFarms,
  getTotalLPWethValue,
} from '../contracts/utils';
import usePayr from './usePayr';
import useBlock from './useBlock';


const useAllStakedValue = () => {
  const [balances, setBalance] = useState([]);
  const { account } = useWallet();
  const payr = usePayr();
  const farms = getFarms(payr);
  const farmContract = getFarmContract(payr);
  const wethContact = getWethContract(payr);
  const block = useBlock();

  const fetchAllStakedValue = useCallback(async () => {
    const balances = await Promise.all(
      farms.map(
        ({
          pid,
          lpContract,
          tokenContract,
        }) =>
          getTotalLPWethValue(
            farmContract,
            wethContact,
            lpContract,
            tokenContract,
            pid,
          ),
      ),
    );

    setBalance(balances);
  }, [account, farmContract, payr]);

  useEffect(() => {
    if (account && farmContract && payr) {
      fetchAllStakedValue()
    }
  }, [account, block, farmContract, setBalance, payr])

  return balances;
}

export default useAllStakedValue;
