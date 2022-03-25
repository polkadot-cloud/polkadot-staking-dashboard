// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, useRef } from 'react';
import { PageTitleWrapper } from '../../Wrappers';

export const PageTitle = ({ title }: any) => {

  const [isSticky, setIsSticky] = useState(false);
  const ref = useRef();

  // mount 
  useEffect(() => {
    const cachedRef: any = ref.current;
    const observer = new IntersectionObserver(
      ([e]) => setIsSticky(e.intersectionRatio < 1),
      {
        threshold: [1],
        rootMargin: '-1px 0px 0px 0px',  // alternativly, use this and set `top:0` in the CSS
      }
    )

    observer.observe(cachedRef);

    // unmount
    return function () {
      observer.unobserve(cachedRef);
    }
  }, [])

  return (
    <PageTitleWrapper ref={ref} isSticky={isSticky}>
      <h1>{title}</h1>
    </PageTitleWrapper>
  )
}

export default PageTitle;