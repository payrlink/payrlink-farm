import { useCallback } from 'react';

import usePayr from './usePayr';
import { useWallet } from 'use-wallet';

import { approve, getFarmContract } from '../contracts/utils';

const useApprove = (lpContract) => {
  const { account } = useWallet();
  const payr = usePayr();
  const farmContract = getFarmContract(payr);

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, farmContract, account);
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, lpContract, farmContract]);

  return { onApprove: handleApprove };
}

export default useApprove;
