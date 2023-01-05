// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useFilters } from 'contexts/Filters';
import { useState } from 'react';
import { TabsWrapper, TabWrapper } from './Wrappers';

export const Tabs = ({ config, activeIndex }: any) => {
  const { resetFilters, setMultiFilters } = useFilters();

  const [active, setActive] = useState<number>(activeIndex);

  return (
    <TabsWrapper>
      {config.map((c: any, i: number) => (
        <TabWrapper
          key={`pools_tab_filter_${i}`}
          active={i === active}
          onClick={() => {
            resetFilters('include', 'pools');
            resetFilters('exclude', 'pools');
            if (c.includes?.length) {
              setMultiFilters('include', 'pools', c.includes);
            }
            if (c.excludes?.length) {
              setMultiFilters('exclude', 'pools', c.excludes);
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
