// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, useRef } from 'react';
import { useApi } from '../../contexts/Api';
import { useUi } from '../../contexts/UI';

export const usePrices = () => {

  const { network, fetchDotPrice }: any = useApi();
  const { services }: any = useUi();

  let _prices = localStorage.getItem(`${network.name}_prices`);
  _prices = _prices === null
    ? {
      lastPrice: 0,
      change: 0,
    }
    : JSON.parse(_prices);

  const [prices, _setPrices]: any = useState(_prices);

  const pricesRef = useRef(prices);
  const setPrices = (_prices: any) => {
    localStorage.setItem(`${network.name}_prices`, JSON.stringify(_prices));
    pricesRef.current = prices;
    _setPrices({
      ...pricesRef.current,
      ..._prices
    });
  }

  const initiatePriceInterval = async () => {
    const prices = await fetchDotPrice();
    setPrices(prices);
    if (priceHandle === null) {
      setPriceInterval();
    }
  }

  let priceHandle: any = null;
  const setPriceInterval = async () => {
    priceHandle = setInterval(async () => {
      const prices = await fetchDotPrice();
      setPrices(prices);
    }, 1000 * 30);
  }

  // initial price subscribe
  useEffect(() => {
    initiatePriceInterval();
    return (() => {
      if (priceHandle !== null) {
        clearInterval(priceHandle);
      }
    })
  }, []);

  // resubscribe on network toggle
  useEffect(() => {
    if (priceHandle !== null) {
      clearInterval(priceHandle);
    }
    initiatePriceInterval();
  }, [network]);

  // servie toggle
  useEffect(() => {
    if (services.includes('binance_spot')) {
      if (priceHandle === null) {
        initiatePriceInterval();
      }
    } else {
      if (priceHandle !== null) {
        clearInterval(priceHandle);
      }
    }
  }, [services]);

  return prices;
}

export default usePrices;