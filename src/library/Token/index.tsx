// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Suspense, lazy, useMemo } from 'react';
import { TokenSvgWrapper, TokenWrapper } from './Wrappers';

export const Token = ({ symbol }: { symbol: string }) => {
  const Jsx = useMemo(
    () => lazy(() => import(`../../config/tokens/jsx/${symbol}.tsx`)),
    []
  );

  return (
    <TokenWrapper>
      <TokenSvgWrapper>
        <Suspense fallback={<div />}>
          <Jsx />
        </Suspense>
      </TokenSvgWrapper>
    </TokenWrapper>
  );
};
