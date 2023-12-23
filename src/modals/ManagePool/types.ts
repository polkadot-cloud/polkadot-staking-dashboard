// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Dispatch, SetStateAction } from 'react';

export interface TasksProps {
  setSection: Dispatch<SetStateAction<number>>;
  setTask: Dispatch<SetStateAction<string | undefined>>;
}
