// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ImportedAccount } from '@w3ux/react-connect-kit/types';
import type { FunctionComponent, SVGProps } from 'react';
import type { AnyFunction } from 'types';

export interface HeadingProps {
  connectTo?: string;
  disabled?: boolean;
  handleReset?: () => void;
  Icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  title: string;
}

export interface AddressProps {
  address: string;
  index: number;
  initial: string;
  disableEditIfImported?: boolean;
  renameHandler: AnyFunction;
  existsHandler: AnyFunction;
  openRemoveHandler: AnyFunction;
  openConfirmHandler: AnyFunction;
  t: {
    tImport: string;
    tRemove: string;
  };
}

export interface ConfirmProps {
  address: string;
  index: number;
  source: string;
  addHandler: (
    address: string,
    index: number,
    callback?: () => void
  ) => ImportedAccount | null;
}

export interface RemoveProps {
  address: string;
  source: string;
  getHandler: (address: string) => ImportedAccount | null;
  removeHandler: (address: string, callback?: () => void) => void;
}
