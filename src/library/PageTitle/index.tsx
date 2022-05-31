// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useRef, useEffect } from 'react';
import { PageTitleWrapper, MenuPaddingWrapper } from 'Wrappers';

export const PageTitle = (props: any) => {
  const { title } = props;
  const [sticky, setSticky] = useState(false);

  const ref: any = useRef();

  useEffect(() => {
    const cachedRef = ref.current;
    const observer = new IntersectionObserver(
      ([e]) => {
        setSticky(e.intersectionRatio < 1);
      },
      { threshold: [1], rootMargin: '-1px 0px 0px 0px' }
    );
    observer.observe(cachedRef);
    // unmount
    return () => {
      observer.unobserve(cachedRef);
    };
  }, [sticky]);

  return (
    <>
      <MenuPaddingWrapper />
      <PageTitleWrapper ref={ref} sticky={sticky}>
        <h1 className="page-padding">{title}</h1>
      </PageTitleWrapper>
    </>
  );
};

export default PageTitle;
