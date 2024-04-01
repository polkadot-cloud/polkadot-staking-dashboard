// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CanvasFullScreenWrapper } from 'canvas/Wrappers';
import { useOverlay } from 'kits/Overlay/Provider';
import { JoinPoolInterfaceWrapper } from './Wrappers';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useState } from 'react';
import { Header } from './Header';
import { Overview } from './Overview';
import { Nominations } from './Nominations';
import { useValidators } from 'contexts/Validators/ValidatorEntries';

export const JoinPool = () => {
  const {
    config: { options },
  } = useOverlay().canvas;
  const { validators } = useValidators();
  const { poolsMetaData, poolsNominations, bondedPools } = useBondedPools();

  // The active canvas tab.
  const [activeTab, setActiveTab] = useState(0);

  // Only choose an open pool.
  const filteredBondedPools = bondedPools.filter(
    (pool) => pool.state === 'Open'
  );
  const randomKey = (filteredBondedPools.length * Math.random()) << 0;
  const bondedPool = filteredBondedPools[randomKey];

  // The selected pool id. Use the provided poolId, or assign a random pool.
  const [selectedPoolId, setSelectedPoolId] = useState<number>(
    options?.poolId || bondedPool.id
  );

  // Extract validator entries from pool targets
  const targets = poolsNominations[bondedPool.id]?.targets || [];
  const targetValidators = validators.filter(({ address }) =>
    targets.includes(address)
  );

  return (
    <CanvasFullScreenWrapper>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedPoolId={setSelectedPoolId}
        bondedPool={bondedPool}
        metadata={poolsMetaData[selectedPoolId]}
      />

      <JoinPoolInterfaceWrapper>
        <div className="content">
          {activeTab === 0 && <Overview bondedPool={bondedPool} />}
          {activeTab === 1 && (
            <Nominations
              stash={bondedPool.addresses.stash}
              targets={targetValidators}
            />
          )}
        </div>
      </JoinPoolInterfaceWrapper>
    </CanvasFullScreenWrapper>
  );
};
