import { useCallback, useEffect, useState } from 'react';

import BigNumber from 'bignumber.js';
import usePayr from './usePayr';
import { useWallet } from 'use-wallet';

import { getAllowance } from '../utils/erc20';
import { getFarmContract } from '../contracts/utils';

const useAllowance = (lpContract) => {
  const [allowance, setAllowance] = useState(new BigNumber(0));
  const { account } = useWallet();
  const payr = usePayr();
  const farmContract = getFarmContract(payr);

  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(
      lpContract,
      farmContract,
      account,
    );
    setAllowance(new BigNumber(allowance));
  }, [account, farmContract, lpContract]);

  useEffect(() => {
    if (account && farmContract && lpContract) {
      fetchAllowance();
    }
    let refreshInterval = setInterval(fetchAllowance, 10000);
    return () => clearInterval(refreshInterval);
  }, [account, farmContract, lpContract]);

  return allowance;
}

export default useAllowance;
