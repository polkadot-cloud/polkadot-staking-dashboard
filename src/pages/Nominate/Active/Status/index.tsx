// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Separator } from '@polkadotcloud/core-ui';
import { CardWrapper } from 'library/Card/Wrappers';
import { ControllerStatus } from './ControllerStatus';
import { NominationStatus } from './NominationStatus';
import { PayoutDestinationStatus } from './PayoutDestinationStatus';

export const Status = ({ height }: { height: number }) => (
  <CardWrapper height={height}>
    <NominationStatus />
    <Separator />
    <PayoutDestinationStatus />
    <Separator />
    <ControllerStatus />
  </CardWrapper>
);
