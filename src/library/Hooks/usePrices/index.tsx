// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef, useState } from 'react';
import { usePlugins } from 'contexts/Plugins';
import { useUnitPrice } from 'library/Hooks/useUnitPrice';
import { useNetwork } from 'contexts/Network';

export const usePrices = () => {
  const { network } = useNetwork();
  const { plugins } = usePlugins();
  const fetchUnitPrice = useUnitPrice();

  const pricesLocalStorage = () => {
    const pricesLocal = localStorage.getItem(`${network}_prices`);
    return pricesLocal === null
      ? {
          lastPrice: 0,
          change: 0,
        }
      : JSON.parse(pricesLocal);
  };

  const [prices, _setPrices] = useState(pricesLocalStorage());
  const pricesRef = useRef(prices);

  const setPrices = (p: any) => {
    localStorage.setItem(`${network}_prices`, JSON.stringify(p));
    pricesRef.current = {
      ...pricesRef.current,
      ...p,
    };
    _setPrices({
      ...pricesRef.current,
      ...p,
    });
  };

  const initiatePriceInterval = async () => {
    setPrices(await fetchUnitPrice());
    if (priceHandle === null) {
      setPriceInterval();
    }
  };

  let priceHandle: any = null;
  const setPriceInterval = async () => {
    priceHandle = setInterval(async () => {
      setPrices(await fetchUnitPrice());
    }, 1000 * 30);
  };

  // initial price subscribe
  useEffect(() => {
    initiatePriceInterval();
    return () => {
      if (priceHandle !== null) {
        clearInterval(priceHandle);
      }
    };
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
    if (plugins.includes('binance_spot')) {
      if (priceHandle === null) {
        initiatePriceInterval();
      }
    } else if (priceHandle !== null) {
      clearInterval(priceHandle);
    }
  }, [plugins]);

  return pricesRef.current;
};
