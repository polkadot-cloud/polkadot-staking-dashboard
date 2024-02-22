// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { CardWrapper } from 'library/Card/Wrappers';
import { UnclaimedPayoutsStatus } from './UnclaimedPayoutsStatus';
import { NominationStatus } from './NominationStatus';
import { PayoutDestinationStatus } from './PayoutDestinationStatus';
import { Separator } from 'kits/Structure/Separator';

export const Status = ({ height }: { height: number }) => (
  <CardWrapper height={height}>
    <NominationStatus />
    <Separator />
    <UnclaimedPayoutsStatus />
    <Separator />
    <PayoutDestinationStatus />
  </CardWrapper>
);
