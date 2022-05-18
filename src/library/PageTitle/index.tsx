// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, useRef } from 'react';
import { PageTitleWrapper } from '../../Wrappers';

export const PageTitle = (props: any) => {
  const { title, setStickyTitle } = props;
  const [isSticky, setIsSticky] = useState(false);

  const ref: any = useRef();

  // mount
  useEffect(() => {
    const cachedRef = ref.current;
    const observer = new IntersectionObserver(
      ([e]) => setIsSticky(e.intersectionRatio < 1),
      {
        threshold: [1],
        rootMargin: '-1px 0px 0px 0px',
      }
    );
    observer.observe(cachedRef);
    // unmount
    return () => {
      observer.unobserve(cachedRef);
    };
  }, [isSticky]);

  useEffect(() => {
    // if a parent component is monitoring sticky state,
    // update it here.
    if (setStickyTitle !== undefined) {
      setStickyTitle(isSticky);
    }
  }, [isSticky]);

  return (
    <PageTitleWrapper ref={ref} isSticky={isSticky}>
      <h1>{title}</h1>
    </PageTitleWrapper>
  );
};

export default PageTitle;
