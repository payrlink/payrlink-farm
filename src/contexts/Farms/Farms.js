import React, { useState } from 'react';

import usePayr from '../../hooks/usePayr';
import { getFarms } from '../../contracts/utils';

import Context from './context';

const Farms = ({ children }) => {
  const [unharvested] = useState(0);

  const payr = usePayr();
  const farms = getFarms(payr);

  return (
    <Context.Provider
      value={{
        farms,
        unharvested,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Farms;
