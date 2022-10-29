// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FunctionComponent, SVGProps } from 'react';
import { ReactComponent as PolkadotJSSVG } from './icons/dot_icon.svg';
import { ReactComponent as EnkryptSVG } from './icons/enkrypt_icon.svg';
import { ReactComponent as NovaWalletSVG } from './icons/nova_wallet.svg';
import { ReactComponent as SignerSVG } from './icons/signer_icon.svg';
import { ReactComponent as SubwalletSVG } from './icons/subwallet_icon.svg';
import { ReactComponent as TalismanSVG } from './icons/talisman_icon.svg';

export interface ExtensionConfig {
  id: string;
  title: string;
  icon: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string }>;
}
export const EXTENSIONS: ExtensionConfig[] = [
  {
    id: 'enkrypt',
    title: 'Enkrypt',
    icon: EnkryptSVG,
  },
  {
    id: 'polkadot-js',
    title: (window as any)?.walletExtension?.isNovaWallet
      ? 'Nova Wallet'
      : 'Polkadot JS',
    icon: (window as any)?.walletExtension?.isNovaWallet
      ? NovaWalletSVG
      : PolkadotJSSVG,
  },
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
    id: 'parity-signer-companion',
    title: 'Parity Signer Companion',
    icon: SignerSVG,
  },
];
