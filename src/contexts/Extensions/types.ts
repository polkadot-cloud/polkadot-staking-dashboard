// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FunctionComponent, SVGProps } from 'react';
import { AnyApi } from 'types';

export interface ExtensionsContextInterface {
  extensions: Array<Extension>;
  extensionsStatus: { [key: string]: string };
  extensionsFetched: boolean;
  setExtensionStatus: (id: string, s: string) => void;
  setExtensionsFetched: (s: boolean) => void;
  setExtensions: (s: Array<Extension>) => void;
}

export interface ExtensionInteface {
  accounts: AnyApi;
  metadata: AnyApi;
  provider: AnyApi;
  signer: AnyApi;
}

export interface Extension {
  id: string;
  title: string;
  icon: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
  enable: (n: string) => Promise<ExtensionInteface>;
  version: string;
}
