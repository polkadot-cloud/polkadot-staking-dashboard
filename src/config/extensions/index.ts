// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ExtensionConfig } from 'contexts/Extensions/types';
import { ReactComponent as EnkryptSVG } from './icons/enkrypt_icon.svg';
import { ReactComponent as FearlessSVG } from './icons/fearless.svg';
import { ReactComponent as NovaWalletSVG } from './icons/nova_wallet.svg';
import { ReactComponent as PolkadotJSSVG } from './icons/polkadot_js.svg';
import { ReactComponent as SignerSVG } from './icons/signer_icon.svg';
import { ReactComponent as SubwalletSVG } from './icons/subwallet_icon.svg';
import { ReactComponent as TalismanSVG } from './icons/talisman_icon.svg';

export const Extensions: Array<ExtensionConfig> = [
  {
    id: 'polkadot-js',
    title: (window as any)?.walletExtension?.isNovaWallet
      ? 'Nova Wallet'
      : 'Polkadot JS',
    icon: (window as any)?.walletExtension?.isNovaWallet
      ? NovaWalletSVG
      : PolkadotJSSVG,
    url: (window as any)?.walletExtension?.isNovaWallet
      ? 'novawallet.io'
      : 'polkadot.js.org/extension',
  },
  {
    id: 'enkrypt',
    title: 'Enkrypt',
    icon: EnkryptSVG,
    url: 'enkrypt.com',
  },
  {
    id: 'fearless-wallet',
    title: 'Fearless Wallet',
    icon: FearlessSVG,
    url: 'fearlesswallet.io',
  },
  {
    id: 'parity-signer-companion',
    title: 'Parity Signer Companion',
    icon: SignerSVG,
    url: 'parity.io/technologies/signer',
  },
  {
    id: 'subwallet-js',
    title: 'SubWallet',
    icon: SubwalletSVG,
    url: 'subwallet.app',
  },
  {
    id: 'talisman',
    title: 'Talisman',
    icon: TalismanSVG,
    url: 'talisman.xyz',
  },
];
