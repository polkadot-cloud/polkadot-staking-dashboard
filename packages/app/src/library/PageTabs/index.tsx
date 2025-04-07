// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import classNames from 'classnames'
import type { PageTitleProps, PageTitleTabProps } from 'types'
import { ButtonTab } from 'ui-buttons'
import classes from './index.module.scss'

export const PageTabs = ({
  sticky,
  tabs = [],
  inline = false,
  tabClassName,
  colorSecondary,
}: PageTitleProps) => {
  const buttonClasses = classNames(classes.pageTitleTabs, {
    [classes.inline]: inline,
    [classes.sticky]: sticky,
  })

  return (
    <section className={buttonClasses}>
      <div className={classes.scroll}>
        <div className={classes.inner}>
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
