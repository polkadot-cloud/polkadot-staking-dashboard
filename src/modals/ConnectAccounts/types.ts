import { FunctionComponent, SVGProps } from 'react';
import { ExtensionAccount } from 'contexts/Connect/types';
import { BalanceLedger } from 'contexts/Balances/types';
import { MaybeAccount } from 'types';

export interface ExtensionProps {
  meta: ExtensionMetaProps;
  setSection: (n: number) => void;
  installed?: any;
  size?: string;
  message?: string;
  flag?: boolean;
  status?: string;
}

export interface ExtensionMetaProps {
  id: string;
  title: string;
  icon: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
  status?: string;
}

export interface AccountElementProps {
  meta: ExtensionAccount | null;
  address?: MaybeAccount;
  label?: string[];
  disconnect?: boolean;
  asElement?: boolean;
}

export interface ReadOnlyProps {
  setReadOnlyOpen: (k: boolean) => void;
  readOnlyOpen: boolean;
}

export interface forwardRefProps {
  setSection?: any;
  readOnlyOpen: boolean;
  setReadOnlyOpen: (e: boolean) => void;
}

export interface ControllerAccount {
  address: string;
  ledger: BalanceLedger;
}

export interface StashAcount {
  address: string;
  controller: MaybeAccount;
}

export interface ActivelyStakingAccount {
  stash: MaybeAccount;
  controller: MaybeAccount;
  stashImported: boolean;
  controllerImported: boolean;
}
