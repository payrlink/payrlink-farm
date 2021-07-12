import BigNumber from 'bignumber.js'

export { default as formatAddress } from './formatAddress'

export const bnToDec = (bn, decimals = 18) => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}

export const decToBn = (dec, decimals = 18) => {
  return new BigNumber(dec).multipliedBy(new BigNumber(10).pow(decimals))
}

export const toFixed = (num, fixed = true, digit = 4) => {
  const exp = Math.pow(10, digit);
  const fixed_num = Math.floor(Number(num) * exp) / exp;
  if (fixed)
    return fixed_num.toFixed(digit);
  else
    return Number(fixed_num.toString());
}