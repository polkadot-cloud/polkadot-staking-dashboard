// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TimeLeftFormatted } from 'library/Hooks/useTimeLeft/types';

export interface CountdownProps {
  timeleft: TimeLeftFormatted;
  markup?: boolean;
}
