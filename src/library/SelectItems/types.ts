// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Dispatch, SetStateAction } from 'react';
import { AnyJson, MaybeAccount } from 'types';

export interface SelectItemProps {
  title: string;
  subtitle: string;
  icon: AnyJson;
  selected: boolean;
  onClick: () => void;
  hoverBorder?: boolean;
  grow?: boolean;
  disabled?: boolean;
  includeToggle?: boolean;
  bodyRef?: AnyJson;
  containerRef?: AnyJson;
  account?: MaybeAccount;
  setAccount?: Dispatch<SetStateAction<MaybeAccount>>;
}
