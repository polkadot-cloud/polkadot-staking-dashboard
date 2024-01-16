// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Dispatch, SetStateAction } from 'react';

export interface ExtensionProps {
  meta: ExtensionMetaProps;
  size?: string;
  flag?: boolean;
}

export interface ExtensionMetaProps {
  id: string;
  title: string;
  status?: string;
  website: string | [string, string];
}

export interface ListWithInputProps {
  setInputOpen: (k: boolean) => void;
  inputOpen: boolean;
}

export interface forwardRefProps {
  setSection?: Dispatch<SetStateAction<number>>;
  readOnlyOpen: boolean;
  setReadOnlyOpen: (e: boolean) => void;
}
