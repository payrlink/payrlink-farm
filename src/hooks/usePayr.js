import { useContext } from 'react';
import { Context } from '../contexts/PayrProvider';

const usePayr = () => {
  const { payr } = useContext(Context);
  return payr;
}

export default usePayr;