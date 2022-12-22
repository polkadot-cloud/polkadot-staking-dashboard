// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FunctionComponent, SVGProps } from 'react';
import { AnyApi } from 'types';

// configuration item of an extension specific to the dashboard.
// configured in src/config/extensions/index.tsx.
export interface ExtensionConfig {
  id: string;
  title: string;
  icon: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
}

// top level required properties the extension must expose via their
// `injectedWeb3` entry.
export interface Extension extends ExtensionConfig {
  id: string;
  enable: (n: string) => Promise<ExtensionInteface>;
}

// the rquired properties `enable` must provide after resolution.
export interface ExtensionInteface {
  accounts: {
    subscribe: AnyApi;
  };
  provider: AnyApi;
  signer: AnyApi;
}

// the required properties returned after subscribing to accounts.
export interface ExtensionAccount extends ExtensionMetadata {
  address: string;
  name: string;
  signer?: unknown;
}

// dashboard specific: miscellaneous metadata added to an extension by the
// dashboard.
export interface ExtensionMetadata {
  addedBy?: string;
  source: string;
}

// dashboard specific: extensions context interface.
export interface ExtensionsContextInterface {
  extensions: Array<Extension>;
  extensionsStatus: { [key: string]: string };
  extensionsFetched: boolean;
  setExtensionStatus: (id: string, s: string) => void;
  setExtensionsFetched: (s: boolean) => void;
  setExtensions: (s: Array<Extension>) => void;
}
