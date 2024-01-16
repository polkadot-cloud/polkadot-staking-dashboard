// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import throttle from 'lodash.throttle';
import { useEffect, useState } from 'react';
import { useUi } from 'contexts/UI';

export const getSize = (element?: HTMLElement | undefined) => {
  const width = element?.offsetWidth || 0;
  const height = element?.offsetHeight || 0;
  return { height, width };
};

export const useSize = (element?: HTMLElement | undefined) => {
  const { containerRefs } = useUi();
  const [size, setSize] = useState<{ width: number; height: number }>(
    getSize(element)
  );

  const throttleCallback = () => {
    setSize(getSize(element));
  };

  useEffect(() => {
    const resizeThrottle = throttle(throttleCallback, 100, {
      trailing: true,
      leading: false,
    });

    // listen to main interface resize if ref is available, otherwise
    // fall back to window resize.
    const listenFor = containerRefs?.mainInterface?.current ?? window;
    listenFor.addEventListener('resize', resizeThrottle);
    return () => {
      listenFor.removeEventListener('resize', resizeThrottle);
    };
  });
  return size;
};
