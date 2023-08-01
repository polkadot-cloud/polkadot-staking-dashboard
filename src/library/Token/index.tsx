// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Suspense, lazy, useMemo } from 'react';

export const Token = ({ symbol }: { symbol: string }) => {
  const Jsx = useMemo(
    () => lazy(() => import(`../../config/tokens/jsx/${symbol}.tsx`)),
    []
  );

  return (
    <div className="token">
      <Suspense fallback={<div />}>
        <Jsx />
      </Suspense>
    </div>
  );
};
