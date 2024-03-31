// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CanvasFullScreenWrapper } from 'canvas/Wrappers';
import { useOverlay } from 'kits/Overlay/Provider';
import { JoinPoolInterfaceWrapper, StatsWrapper } from './Wrappers';
import { useBondedPools } from 'contexts/Pools/BondedPools';
import { JoinForm } from './JoinForm';
import { useState } from 'react';
import { useApi } from 'contexts/Api';
import { Header } from './Header';

export const JoinPool = () => {
  const {
    closeCanvas,
    config: { options },
  } = useOverlay().canvas;
  const { counterForBondedPools } = useApi().poolsConfig;
  const { getBondedPool, poolsMetaData } = useBondedPools();

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
          <div>
            <StatsWrapper>
              <h3>Active</h3>
            </StatsWrapper>
          </div>
          <div>
            <JoinForm />
          </div>
        </div>
      </JoinPoolInterfaceWrapper>
    </CanvasFullScreenWrapper>
  );
};
