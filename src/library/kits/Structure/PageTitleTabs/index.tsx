// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ButtonTab } from 'library/kits/Buttons/ButtonTab';
import type { PageTitleProps } from '../PageTitle/types';
import type { PageTitleTabProps } from './types';
import { appendOrEmpty } from '@polkadot-cloud/utils';
import { Wrapper } from './Wrapper';

/**
 * @name PageTitleTabs
 * @summary The element in a page title. Inculding the ButtonTab.
 */
export const PageTitleTabs = ({ sticky, tabs = [] }: PageTitleProps) => (
  <Wrapper className={`${appendOrEmpty(sticky, 'sticky')}`}>
    <div className="scroll">
      <div className="inner">
        {tabs.map(
          ({ active, onClick, title, badge }: PageTitleTabProps, i: number) => (
            <ButtonTab
              active={!!active}
              key={`page_tab_${i}`}
              onClick={() => onClick()}
              title={title}
              badge={badge}
            />
          )
        )}
      </div>
    </div>
  </Wrapper>
);
