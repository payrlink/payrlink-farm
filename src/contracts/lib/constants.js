export const contractAddresses = {
  erc20: {
    42: '0x6587B4304Ab73e63F407C0D7AFB74334F6ff94B2',
    1: '0xc93d74b2cbccd0995b8214b38e15fcb4bf842220',
  },
  farm: {
    42: '0x2089b02D447692D36873b39514c627a56213B692',
    1: '0x5E4700C6610113077ea0413b48fC35f7cC953618',
  },
  weth: {
    42: '0xa050886815cfc52a24b9c4ad044ca199990b6690',
    1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  }
}

export const supportedPools = [
  {
    pid: 0,
    lpAddresses: {
      42: '0x4c20a74f95e41be819a5393b7e9544139813af36',
      1: '0xed24067ea77d730d16bfd81011805dab7ac8d530',
    },
    tokenAddresses: {
      42: '0x6587B4304Ab73e63F407C0D7AFB74334F6ff94B2',
      1: '0xc93d74b2cbccd0995b8214b38e15fcb4bf842220',
    },
    name: 'PAYR-ETH',
    symbol: 'PAYR-ETH UNI-V2 LP',
    tokenSymbol: 'PAYR',
    icon: '',
    pool: '100%',
  }
]
