// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef, useState } from 'react';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { PageTitleTabs } from 'ui-structure';
import { ButtonSecondary } from 'ui-buttons';
import type { PageTitleProps } from '../types';
import classes from './index.module.scss';
import classNames from 'classnames';

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
    const observer = new IntersectionObserver(
      ([entry]) => setSticky(entry.intersectionRatio < 1),
      { threshold: [1], rootMargin: '-1px 0px 0px 0px' }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [sticky]);

  const buttonClasses = classNames(classes.pageTitle, {
    [classes.pageTitle_default]: !sticky,
    [classes.pageTitle_sticky]: sticky,
  });

  const h1Classes = classNames(classes.pageTitle_h1, {
    [classes.pageTitle_h1_default]: !sticky,
    [classes.pageTitle_h1_sticky]: sticky,
  });

  return (
    <>
      <div className={classes.pageTitle_scrollWrapper} />
      <header className={buttonClasses} ref={ref}>
        <section className={classes.pageTitle_title}>
          <div>
            <h1 className={h1Classes}>{title}</h1>
          </div>
          {button && (
            <div className={classes.pageTitle_title_right}>
              <ButtonSecondary
                text={button.title}
                onClick={button.onClick}
                iconRight={faBars}
                iconTransform="shrink-4"
                lg
              />
            </div>
          )}
        </section>
        {tabs.length > 0 && <PageTitleTabs sticky={sticky} tabs={tabs} />}
      </header>
    </>
  );
};
