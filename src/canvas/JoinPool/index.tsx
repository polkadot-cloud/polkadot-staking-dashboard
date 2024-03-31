// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CanvasFullScreenWrapper } from 'canvas/Wrappers';
import { useOverlay } from 'kits/Overlay/Provider';
import { JoinPoolInterfaceWrapper } from './Wrappers';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { useState } from 'react';
import { useApi } from 'contexts/Api';
import { Header } from './Header';
import { Overview } from './Overview';
import { Nominations } from './Nominations';
import { useValidators } from 'contexts/Validators/ValidatorEntries';

export const JoinPool = () => {
  const {
    closeCanvas,
    config: { options },
  } = useOverlay().canvas;
  const { validators } = useValidators();
  const { counterForBondedPools } = useApi().poolsConfig;
  const { getBondedPool, poolsMetaData, poolsNominations } = useBondedPools();

  // The active canvas tab.
  const [activeTab, setActiveTab] = useState(0);

  // The selected pool id. Use the provided poolId, or assign a random pool.
  const [selectedPoolId, setSelectedPoolId] = useState<number>(
    options?.poolId ||
      Math.floor(Math.random() * counterForBondedPools.minus(1).toNumber())
  );

  // Ensure bonded pool exists, and close canvas if not.
  const bondedPool = getBondedPool(selectedPoolId);

  if (!bondedPool) {
    closeCanvas();
    return null;
  }

  const metadata = poolsMetaData[selectedPoolId];

  // Get pool nominees.
  const targets = poolsNominations[bondedPool.id]?.targets || [];

  // Extract validator entries from pool targets
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
        metadata={metadata}
      />

      <JoinPoolInterfaceWrapper>
        <div className="content">
          {activeTab === 0 && <Overview />}
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
