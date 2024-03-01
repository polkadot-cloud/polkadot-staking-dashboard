// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { Dispatch, SetStateAction } from 'react';

export interface ExtensionProps {
  meta: ExtensionMetaProps;
  size?: string;
  flag?: boolean;
  inNova?: boolean;
}

export interface ExtensionMetaProps {
  id: string;
  title: string;
  status?: string;
  website:
    | string
    | {
        url: string;
        text: string;
      };
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
