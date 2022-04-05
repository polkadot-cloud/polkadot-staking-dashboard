// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, useRef } from 'react';
import { PageTitleWrapper } from '../../Wrappers';

export const PageTitle = (props: any) => {

  const { title, setTitleIsSticky } = props;
  const [isSticky, setIsSticky] = useState(false);

  let ref = useRef();

  // mount 
  useEffect(() => {
    const cachedRef: any = ref.current;
    const observer = new IntersectionObserver(
      ([e]) => setIsSticky(e.intersectionRatio < 1),
      {
        threshold: [1],
        rootMargin: '-1px 0px 0px 0px',
      }
    )
    observer.observe(cachedRef);
    // unmount
    return function () {
      observer.unobserve(cachedRef);
    }
  }, [isSticky])

  useEffect(() => {
    // if a parent component is monitoring sticky state, 
    // update it here.
    if (setTitleIsSticky !== undefined) {
      setTitleIsSticky(isSticky);
    }
  }, [isSticky]);

  return (
    <PageTitleWrapper ref={ref} isSticky={isSticky}>
      <h1>{title}</h1>
    </PageTitleWrapper>
  )
}

export default PageTitle;