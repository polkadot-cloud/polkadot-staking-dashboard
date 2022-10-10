// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useRef, useEffect } from 'react';
import { PageTitleWrapper, MenuPaddingWrapper } from 'Wrappers';
import { PageTitleProps } from './types';

export const PageTitle = (props: PageTitleProps) => {
  const { title, button } = props;
  const tabs = props.tabs ?? [];

  const [sticky, setSticky] = useState(false);

  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const cachedRef = ref.current;
    const observer = new IntersectionObserver(
      ([e]) => {
        setSticky(e.intersectionRatio < 1);
      },
      { threshold: [1], rootMargin: '-1px 0px 0px 0px' }
    );

    if (cachedRef) {
      observer.observe(cachedRef);
    }
    // unmount
    return () => {
      if (cachedRef) {
        observer.unobserve(cachedRef);
      }
    };
  }, [sticky]);

  return (
    <>
      <MenuPaddingWrapper />
      <PageTitleWrapper ref={ref} sticky={sticky}>
        <div className="page-padding">
          <section className="title">
            <div>
              <h1>{title}</h1>
            </div>
            <div>
              {button && (
                <button type="button" onClick={() => button.onClick()}>
                  {button.title}
                  <FontAwesomeIcon
                    icon={faBars}
                    className="icon"
                    transform="shrink-4"
                  />
                </button>
              )}
            </div>
          </section>
          {tabs.length > 0 && (
            <section className="tabs">
              <div className="scroll">
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
              </div>
            </section>
          )}
        </div>
      </PageTitleWrapper>
    </>
  );
};

export default PageTitle;
