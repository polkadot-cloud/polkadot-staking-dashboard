// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FunctionComponent, SVGProps } from 'react';
import { ReactComponent as TalismanSVG } from './icons/talisman_icon.svg';
import { ReactComponent as PolkadotJSSVG } from './icons/dot_icon.svg';
import { ReactComponent as SubwalletSVG } from './icons/subwallet_icon.svg';

export interface ExtensionConfig {
  id: string;
  title: string;
  icon: FunctionComponent<
    SVGProps<SVGSVGElement> & { title?: string | undefined }
  >;
}
export const EXTENSIONS: ExtensionConfig[] = [
  {
    id: 'subwallet-js',
    title: 'SubWallet',
    icon: SubwalletSVG,
  },
  {
    id: 'talisman',
    title: 'Talisman',
    icon: TalismanSVG,
  },
  {
    id: 'polkadot-js',
    title: 'Polkadot JS',
    icon: PolkadotJSSVG,
  },
];
