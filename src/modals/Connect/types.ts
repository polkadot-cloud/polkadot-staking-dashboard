// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

export interface ExtensionProps {
  meta: ExtensionMetaProps;
  installed?: any;
  size?: string;
  message?: string;
  flag?: boolean;
  status?: string;
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
  setSection?: any;
  readOnlyOpen: boolean;
  setReadOnlyOpen: (e: boolean) => void;
}
