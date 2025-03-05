// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export const SupportedCurrencies: Record<
  string,
  {
    noDecimals?: boolean
  }
> = {
  USD: {},
  EUR: {},
  GBP: {},
  AUD: {},
  CAD: {},
  CHF: {},
  CNY: {},
  JPY: {
    noDecimals: true,
  },
  INR: {},
  TRY: {},
  BRL: {},
  COP: {
    noDecimals: true,
  },
  UAH: {},
  ZAR: {},
  PLN: {},
  ARS: {},
  MXN: {},
  CZK: {},
  RON: {},
  BGN: {},
  SGD: {},
  NZD: {},
  THB: {},
  KRW: {
    noDecimals: true,
  },
  IDR: {
    noDecimals: true,
  },
  MYR: {},
  PHP: {},
}
