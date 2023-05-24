import type { FunctionComponent, SVGProps } from 'react';
import type { AnyFunction, MaybeString } from 'types';

export interface StatusBarProps {
  handleCancel?: () => void;
  helpKey?: MaybeString;
  inProgress: boolean;
  text: string;
  StatusBarIcon: FunctionComponent<SVGProps<SVGSVGElement>>;
}

export interface HeadingProps {
  connectTo?: string;
  disabled: boolean;
  handleReset?: () => void;
  Icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
  title: string;
}

export interface AddressProps {
  address: string;
  index: number;
  initial: string;
  renameHandler: AnyFunction;
  existsHandler: AnyFunction;
  addHandler: AnyFunction;
  removeHandler: AnyFunction;
  getHandler: AnyFunction;
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
