// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import type { PageTitleProps } from '../../types'
import { TitleTabs } from '../TitleTabs'
import classes from './index.module.scss'

/**
 * @name Title
 * @summary
 * The element that wraps a page title. Determines the padding and position relative to top of
 * screen when the element is stuck.
 */
export const Title = ({ title, tabs = [] }: PageTitleProps) => {
  const [sticky, setSticky] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setSticky(entry.intersectionRatio < 1),
      { threshold: [1], rootMargin: '-1px 0px 0px 0px' }
    )
    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [sticky])

  const buttonClasses = classNames(classes.pageTitle, {
    [classes.pageTitleDefault]: !sticky,
    [classes.pageTitleSticky]: sticky,
  })

  const h1Classes = classNames(classes.pageTitleH1, {
    [classes.pageTitleH1Default]: !sticky,
    [classes.pageTitleH1Sticky]: sticky,
  })

  return (
    <>
      <div className={classes.pageTitleScrollWrapper} />
      <header className={buttonClasses} ref={ref}>
        <section className={classes.pageTitleTitle}>
          <div>
            <h1 className={h1Classes}>{title}</h1>
          </div>
        </section>
        {tabs.length > 0 && <TitleTabs sticky={sticky} tabs={tabs} />}
      </header>
    </>
  )
}
