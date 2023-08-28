// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useState } from 'react';
import { useFilters } from 'contexts/Filters';
import { TabsWrapper, TabWrapper } from './Wrappers';

export const Tabs = ({ config, activeIndex }: any) => {
  const { resetFilters, setMultiFilters } = useFilters();

  const [active, setActive] = useState<number>(activeIndex);

  return (
    <TabsWrapper>
      {config.map((c: any, i: number) => (
        <TabWrapper
          key={`pools_tab_filter_${i}`}
          $active={i === active}
          disabled={i === active}
          onClick={() => {
            if (c.includes?.length) {
              setMultiFilters('include', 'pools', c.includes, true);
            } else {
              resetFilters('include', 'pools');
            }

            if (c.excludes?.length) {
              setMultiFilters('exclude', 'pools', c.excludes, true);
            } else {
              resetFilters('exclude', 'pools');
            }

            setActive(i);
          }}
        >
          {c.label}
        </TabWrapper>
      ))}
    </TabsWrapper>
  );
};
