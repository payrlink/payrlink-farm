import { UseWalletProvider } from 'use-wallet';

import "../scss/App.scss";
import Route from "../route/index";

import PayrProvider from '../contexts/PayrProvider';
import FarmsProvider from '../contexts/Farms';

import { getEthChainInfo } from "../utils/getEthChainInfo"; 

function App() {
  return (
    <Providers>
      <Route />
    </Providers>
  );
}

const Providers = ({ children }) => {

  const {
    chainId,
    rpcUrl
  } = getEthChainInfo();

  return (
    <UseWalletProvider
      chainId={chainId}
      connectors={{
        walletconnect: { rpcUrl }
      }}
    >
      <PayrProvider>
        <FarmsProvider>
          {children}
        </FarmsProvider>
      </PayrProvider>
    </UseWalletProvider>
  )
}

export default App;
