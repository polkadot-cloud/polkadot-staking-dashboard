// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonTab } from 'ui-buttons';
import type { PageTitleProps } from '../PageTitle/types';
import type { PageTitleTabProps } from './types';
import { appendOrEmpty } from '@w3ux/utils';
import { Wrapper } from './Wrapper';

/**
 * @name PageTitleTabs
 * @summary The element in a page title. Inculding the ButtonTab.
 */
export const PageTitleTabs = ({
  sticky,
  tabs = [],
  inline = false,
  tabClassName,
  colorSecondary,
}: PageTitleProps) => (
  <Wrapper
    className={`${appendOrEmpty(sticky, 'sticky')} ${inline ? 'inline' : undefined}`}
  >
    <div className="scroll">
      <div className="inner">
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
  </Wrapper>
);
