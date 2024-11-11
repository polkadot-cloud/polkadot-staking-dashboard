// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef, useState } from 'react';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { PageTitleTabs } from 'ui-structure';
import { ButtonSecondary } from 'ui-buttons';
import { appendOrEmpty } from '@w3ux/utils';
import type { PageTitleProps } from './types';
import { PageTitleWrapper, ScrollableWrapper } from './Wrappers';

/**
 * @name PageTitle
 * @summary
 * The element that wraps a page title. Determines the padding and position relative to top of
 * screen when the element is stuck.
 */
export const PageTitle = ({ title, button, tabs = [] }: PageTitleProps) => {
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
    // unmount.
    return () => {
      if (cachedRef) {
        observer.unobserve(cachedRef);
      }
    };
  }, [sticky]);

  return (
    <>
      <ScrollableWrapper />
      <PageTitleWrapper
        ref={ref}
        className={`page-padding${appendOrEmpty(sticky, 'sticky')}`}
      >
        <section className="title">
          <div>
            <h1>{title}</h1>
          </div>
          <div className="right">
            {button && (
              <ButtonSecondary
                text={button.title}
                onClick={() => button.onClick()}
                iconRight={faBars}
                iconTransform={'shrink-4'}
                lg
              />
            )}
          </div>
        </section>
        {tabs.length > 0 && <PageTitleTabs sticky={sticky} tabs={tabs} />}
      </PageTitleWrapper>
    </>
  );
};

PageTitle.displayName = 'PageTitle';
