// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import throttle from 'lodash.throttle';
import React, { useRef, useEffect } from 'react';
import { SHOW_SIDE_BAR_WIDTH_THRESHOLD } from '../../../consts';
import { Wrapper, ContentWrapper } from './Wrappers';
import { useSideBar } from '../../../contexts/SideBar';
import { useOutsideAlerter } from '../../Hooks';

export const SideBar = ({ children }: { children: React.ReactNode }) => {
  const { closeSideBar, open } = useSideBar();

  const ref = useRef(null);

  useOutsideAlerter(
    ref,
    () => {
      closeSideBar();
    },
    ['ignore-toggle-side-bar']
  );

  // listen to window resize to hide SideBar
  useEffect(() => {
    window.addEventListener('resize', windowThrottle);
    return () => {
      window.removeEventListener('resize', windowThrottle);
    };
  }, []);

  const throttleCallback = () => {
    if (window.innerWidth >= SHOW_SIDE_BAR_WIDTH_THRESHOLD) {
      closeSideBar();
    }
  };
  const windowThrottle = throttle(throttleCallback, 200, {
    trailing: true,
    leading: false,
  });

  const variants = {
    hidden: {
      opacity: 1,
      right: '-600px',
    },
    visible: {
      opacity: 1,
      right: '0px',
    },
  };

  const animate = open ? 'visible' : 'hidden';

  return (
    <Wrapper
      ref={ref}
      initial={false}
      animate={animate}
      transition={{
        duration: 0.5,
        type: 'spring',
        bounce: 0.2,
      }}
      variants={variants}
    >
      <ContentWrapper>{children}</ContentWrapper>
    </Wrapper>
  );
};

export default SideBar;
