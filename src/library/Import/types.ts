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
  addHandler: AnyFunction;
}

export interface RemoveProps {
  address: string;
  getHandler: AnyFunction;
  removeHandler: AnyFunction;
}
