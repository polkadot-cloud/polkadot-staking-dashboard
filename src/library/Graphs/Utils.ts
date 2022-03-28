// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import throttle from 'lodash.throttle';

export const getSize = (element: any) => {
  const width = element?.offsetWidth;
  const height = element?.offsetHeight;
  return { height, width };
}

export const useSize = (element: any) => {
  const [size, setSize] = React.useState(getSize(element));

  React.useEffect(() => {
    const throttleCallback = () => {
      setSize(getSize(element));
    }
    const resizeThrottle = throttle(throttleCallback, 100, { trailing: true, leading: false });

    window.addEventListener('resize', resizeThrottle);
    return (() => {
      window.removeEventListener("resize", resizeThrottle);
    })
  });
  return size;
}

export const formatSize = (size: any, minHeight: number) => {

  let width: any = size.width === undefined ? '100%' : size.width + 'px';
  let height: any = size.height === undefined ? minHeight : size.height + 'px';

  return {
    width: width,
    height: height,
    minHeight: minHeight,
  }
}

export const getGradient = (ctx: any, chartArea: any) => {

  let width, height, gradient;

  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;

  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(0, 'rgba(203, 37, 111, 0.9)');
    gradient.addColorStop(1, 'rgba(223, 81, 144, 0.7)');
  }
  return gradient;
}