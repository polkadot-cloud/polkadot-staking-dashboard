// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';
import { Wrapper, ContentWrapper } from './Wrappers';
import { useSideBar } from '../../../contexts/SideBar';
import { useOutsideAlerter } from '../../../library/Hooks';

export const SideBar = ({ children }: any) => {

  const { closeSideBar, open } = useSideBar();

  const ref = useRef(null);

  useOutsideAlerter(ref, () => {
    closeSideBar();
  }, ['ignore-toggle-side-bar']);

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
        type: "spring",
        bounce: 0.2
      }}
      variants={variants}
    >
      <ContentWrapper>
        {children}
      </ContentWrapper>
    </Wrapper>
  )
}

export default SideBar;