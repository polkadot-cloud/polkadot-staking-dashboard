// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import type { AnyJson, MaybeAddress } from 'types';

export interface SelectItemsProps {
  layout?: 'two-col' | 'three-col';
  children?: ReactNode[];
}

export interface SelectItemProps {
  title: string;
  subtitle: string;
  icon: AnyJson;
  selected: boolean;
  onClick: () => void;
  layout?: 'two-col' | 'three-col';
  hoverBorder?: boolean;
  grow?: boolean;
  disabled?: boolean;
  includeToggle?: boolean;
  bodyRef?: AnyJson;
  containerRef?: AnyJson;
  account?: MaybeAddress;
  setAccount?: Dispatch<SetStateAction<MaybeAddress>>;
}
