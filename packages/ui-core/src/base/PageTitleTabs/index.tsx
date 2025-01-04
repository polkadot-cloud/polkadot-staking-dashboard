// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import { ButtonTab } from 'ui-buttons'
import type { PageTitleProps, PageTitleTabProps } from '../types'
import classes from './index.module.scss'

/**
 * @name PageTitleTabs
 * @summary The element in a page title, inculding ButtonTabs.
 */
export const PageTitleTabs = ({
  sticky,
  tabs = [],
  inline = false,
  tabClassName,
  colorSecondary,
}: PageTitleProps) => {
  const buttonClasses = classNames(classes.pageTitleTabs, {
    [classes.pageTitleTabsInline]: inline,
    [classes.pageTitleTabsSticky]: sticky,
  })

  return (
    <section className={buttonClasses}>
      <div className={classes.pageTitleTabsScroll}>
        <div className={classes.pageTitleTabsInner}>
          {tabs.map(
            (
              { active, onClick, title, badge, disabled }: PageTitleTabProps,
              i: number
            ) => (
              <ButtonTab
                className={tabClassName}
                active={!!active}
                key={`page_tab_${i}`}
                onClick={() => onClick()}
                title={title}
                colorSecondary={colorSecondary}
                badge={badge}
                disabled={disabled === undefined ? false : disabled}
              />
            )
          )}
        </div>
      </div>
    </section>
  )
}
