// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useFilters } from 'contexts/Filters';
import { TabsWrapper, TabWrapper } from './Wrappers';
import type { FilterTabsProps } from './types';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import type { PoolTab } from 'contexts/Pools/BondedPools/types';

export const Tabs = ({ config }: FilterTabsProps) => {
  const { resetFilters, setMultiFilters } = useFilters();
  const { poolListActiveTab, setPoolListActiveTab } = useBondedPools();

  return (
    <TabsWrapper>
      {config.map((c, i) => {
        const label = c.label as PoolTab;

        return (
          <TabWrapper
            key={`pools_tab_filter_${i}`}
            $active={label === poolListActiveTab}
            disabled={label === poolListActiveTab}
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

              setPoolListActiveTab(label);
            }}
          >
            {label}
          </TabWrapper>
        );
      })}
    </TabsWrapper>
  );
};
