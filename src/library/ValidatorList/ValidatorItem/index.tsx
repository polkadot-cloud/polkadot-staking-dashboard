// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { Default } from './Default';
import { Nomination } from './Nomination';
import type { ValidatorItemProps } from './types';

export const ValidatorItem = (props: ValidatorItemProps) => {
  const { format } = props;

  return format === 'nomination' ? (
    <Nomination {...props} />
  ) : (
    <Default {...props} />
  );
};
