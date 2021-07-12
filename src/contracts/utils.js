import { ethers } from 'ethers';

import BigNumber from 'bignumber.js';

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
});

export const getFarmAddress = (payr) => {
  return payr && payr.farmAddress;
}
export const getERC20Address = (payr) => {
  return payr && payr.erc20Address;
}
export const getWethContract = (payr) => {
  return payr && payr.contracts && payr.contracts.weth;
}

export const getFarmContract = (payr) => {
  return payr && payr.contracts && payr.contracts.farm;
}
export const getERC20Contract = (payr) => {
  return payr && payr.contracts && payr.contracts.erc20;
}

export const getFarms = (payr) => {
  return payr
    ? payr.contracts.pools.map(
        ({
          pid,
          name,
          symbol,
          icon,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          lpAddress,
          lpContract,
          pool,
        }) => ({
          pid,
          id: symbol,
          name,
          lpToken: symbol,
          lpTokenAddress: lpAddress,
          lpContract,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          earnToken: 'PAYR',
          earnTokenAddress: payr.contracts.erc20.options.address,
          icon,
          pool,
        }),
      )
    : []
}

export const getPoolWeight = async (farmContract, pid) => {
  try {
    const { allocPoint } = await farmContract.methods.poolInfo(pid).call();
    const totalAllocPoint = await farmContract.methods
      .totalAllocPoint()
      .call();
    return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint));
  } catch {
    return new BigNumber(0);
  }
}

export const getEarned = async (farmContract, pid, account) => {
  return farmContract.methods.pending(pid, account).call();
}

export const getTotalLPWethValue = async (
  farmContract,
  wethContract,
  lpContract,
  tokenContract,
  pid,
) => {
  // Get balance of the token address
  const tokenAmountWholeLP = await tokenContract.methods
    .balanceOf(lpContract.options.address)
    .call();
  const tokenDecimals = await tokenContract.methods.decimals().call();
  // Get the share of lpContract that farmContract owns
  const balance = await lpContract.methods
    .balanceOf(farmContract.options.address)
    .call();
  // Convert that into the portion of total lpContract = p1
  const totalSupply = await lpContract.methods.totalSupply().call();
  // Get total weth value for the lpContract = w1
  const lpContractWeth = await wethContract.methods
    .balanceOf(lpContract.options.address)
    .call();
  // Return p1 * w1 * 2
  const portionLp = new BigNumber(balance).div(new BigNumber(totalSupply));
  const lpWethWorth = new BigNumber(lpContractWeth);
  const totalLpWethValue = portionLp.times(lpWethWorth).times(new BigNumber(2));
  // Calculate
  const tokenAmount = new BigNumber(tokenAmountWholeLP)
    .times(portionLp)
    .div(new BigNumber(10).pow(tokenDecimals));

  const wethAmount = new BigNumber(lpContractWeth)
    .times(portionLp)
    .div(new BigNumber(10).pow(18));
  return {
    tokenAmount,
    wethAmount,
    totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
    tokenPriceInWeth: wethAmount.div(tokenAmount),
    poolWeight: await getPoolWeight(farmContract, pid),
  }
}

export const approve = async (lpContract, farmContract, account) => {
  return lpContract.methods
    .approve(farmContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account });
}

export const getFarmSupply = async (payr) => {
  return new BigNumber(await payr.contracts.erc20.methods.totalSupply().call());
}

export const stake = async (farmContract, pid, amount, account) => {
  return farmContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    });
}

export const unstake = async (farmContract, pid, amount, account) => {
  return farmContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    });
}
export const harvest = async (farmContract, pid, account) => {
  return farmContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    });
}

export const getStaked = async (farmContract, pid, account) => {
  try {
    const { amount } = await farmContract.methods
      .userInfo(pid, account)
      .call();
    return new BigNumber(amount);
  } catch {
    return new BigNumber(0);
  }
}

export const getStakedTime = async (farmContract, pid, account) => {
  try {
    const { timestamp } = await farmContract.methods
      .userInfo(pid, account)
      .call();
    return timestamp;
  } catch {
    return 0;
  }
}

export const redeem = async (farmContract, account) => {
  let now = new Date().getTime() / 1000;
  if (now >= 1597172400) {
    return farmContract.methods
      .exit()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      });
  } else {
    alert('pool not active');
  }
}

export const getPoolContracts = async (yam) => {
  const pools = Object.keys(yam.contracts)
    .filter((c) => c.indexOf('_pool') !== -1)
    .reduce((acc, cur) => {
      const newAcc = { ...acc }
      newAcc[cur] = yam.contracts[cur]
      return newAcc
    }, {});
  return pools;
}

