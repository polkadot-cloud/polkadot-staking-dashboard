// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ValidatorEntry } from '@polkadot-cloud/assets/types';
import { ValidatorCommunity } from '@polkadot-cloud/assets/validators';
import { shuffle } from '@polkadot-cloud/utils';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { defaultCommunityContext } from './defaults';
import type { CommunityContextInterface } from './types';

export const CommunityContext = createContext<CommunityContextInterface>(
  defaultCommunityContext
);

export const useCommunity = () => useContext(CommunityContext);

export const CommunityProvider = ({ children }: { children: ReactNode }) => {
  // Stores a randomised validator community dataset.
  const [validatorCommunity] = useState<ValidatorEntry[]>([
    ...shuffle(ValidatorCommunity),
  ]);

  return (
    <CommunityContext.Provider value={{ validatorCommunity }}>
      {children}
    </CommunityContext.Provider>
  );
};
