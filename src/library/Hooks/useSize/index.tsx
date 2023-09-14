// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import throttle from 'lodash.throttle';
import React from 'react';
import { useUi } from 'contexts/UI';

export const getSize = (element: any) => {
  const width = element?.offsetWidth;
  const height = element?.offsetHeight;
  return { height, width };
};

export const useSize = (element: any) => {
  const { containerRefs } = useUi();

  const [size, setSize] = React.useState(getSize(element));

  const throttleCallback = () => {
    setSize(getSize(element));
  };

  React.useEffect(() => {
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
