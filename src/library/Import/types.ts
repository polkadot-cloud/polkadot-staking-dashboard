import type { ImportedAccount } from '@polkadot-cloud/react/types';
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
  addHandler: (
    address: string,
    index: number,
    callback?: () => void
  ) => ImportedAccount | null;
}

export interface RemoveProps {
  address: string;
  getHandler: (address: string) => ImportedAccount | null;
  removeHandler: (address: string, callback?: () => void) => void;
}
