// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import throttle from 'lodash.throttle';
import type { MutableRefObject } from 'react';
import { useEffect, useState } from 'react';

// Custom hook to get the width and height of a specified element. Updates the `size` state when the
// specified "outer element" (or the window by default) resizes.
export const useSize = (
  element: MutableRefObject<HTMLElement | null | undefined>,
  outerElement?: MutableRefObject<HTMLElement | null | undefined>
) => {
  // Helper function to retrieve the width and height of an element
  // If no element is found, default dimensions are set to 0.
  const getSize = (el: HTMLElement | null = null) => {
    const width = el?.offsetWidth || 0;
    const height = el?.offsetHeight || 0;
    return { width, height };
  };

  // State to store the current width and height of the specified element.
  const [size, setSize] = useState<{ width: number; height: number }>(
    getSize(element?.current)
  );

  // Throttle the resize event handler to limit how often size updates occur.
  const resizeThrottle = throttle(() => {
    setSize(getSize(element?.current));
  }, 100);

  // Set up the resize event listener on mount and clean it up on unmount.
  useEffect(() => {
    // Determine the target for the resize event listener.
    // If `outerElement` is provided, listen to its resize events; otherwise, listen to the window's.
    const listenFor = outerElement?.current || window;

    listenFor.addEventListener('resize', resizeThrottle);

    // Clean up event listener when the component unmounts to avoid memory leaks.
    return () => {
      listenFor.removeEventListener('resize', resizeThrottle);
    };
  }, [outerElement]);

  // Return the current size of the element.
  return size;
};
