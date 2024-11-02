// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import throttle from 'lodash.throttle';
import type { MutableRefObject } from 'react';
import { useEffect, useState } from 'react';

// Gets the width and height of the provided element when an outer element resizes. This outer
// element can be provided, and defaults to the window if not provided.
export const useSize = (
  element: MutableRefObject<HTMLElement | null | undefined>,
  outerElement?: MutableRefObject<HTMLElement | null | undefined>
) => {
  // Private function that gets the offset width and height of an element.
  const getSize = (el: HTMLElement | null = null) => {
    const width = el?.offsetWidth || 0;
    const height = el?.offsetHeight || 0;
    return { height, width };
  };

  // Store the size of an element.
  const [size, setSize] = useState<{ width: number; height: number }>(
    getSize(element?.current)
  );

  // Throttle the resize event to prevent it from firing too often.
  const resizeThrottle = throttle(() => {
    setSize(getSize(element?.current));
  }, 100);

  // Initialise event listeners when the component mounts.
  useEffect(() => {
    // listen to the provided outer element resize if `outerElement`` is provided, otherwise fall
    // back to window resize.
    const listenFor = outerElement?.current || window;

    listenFor.addEventListener('resize', resizeThrottle);
    return () => {
      // Clean up event listeners when the component unmounts.
      listenFor.removeEventListener('resize', resizeThrottle);
    };
  }, []);

  return size;
};
