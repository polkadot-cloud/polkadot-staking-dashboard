// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useRef, useEffect } from 'react';
import { PageTitleWrapper, MenuPaddingWrapper } from 'Wrappers';
import { PageTitleProps } from './types';

export const PageTitle = (props: PageTitleProps) => {
  const { title } = props;
  const tabs = props.tabs ?? [];

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
        {tabs.length > 0 && (
          <section className="tabs page-padding">
            <div className="inner">
              {tabs.map((tab: any, i: number) => (
                <button
                  className={tab.active ? `active` : ``}
                  key={`page_tab_${i}`}
                  type="button"
                  onClick={() => tab.onClick()}
                >
                  {tab.title}
                </button>
              ))}
            </div>
          </section>
        )}
      </PageTitleWrapper>
    </>
  );
};

export default PageTitle;
