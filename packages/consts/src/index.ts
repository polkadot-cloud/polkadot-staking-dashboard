// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Global Constants
export const DappName = 'Polkadot Cloud Staking'
export const ManualSigners = ['ledger', 'vault', 'wallet_connect']
export const DiscordSupportUrl = 'https://discord.gg/QY7CSSJm3D'
export const MailSupportAddress = 'staking@polkadot.cloud'
export const GitHubURl =
  'https://github.com/polkadot-cloud/polkadot-staking-dashboard'

// Element Thresholds
export const SideMenuHiddenWidth = 195
export const SideMenuMaximisedWidth = 145
export const SideMenuMinimisedWidth = 75
export const SectionFullWidthThreshold = 1000
export const PageWidthMediumThreshold = 1150
export const SmallFontSizeMaxWidth = 600

export const TipsThresholdSmall = 750
export const TipsThresholdMedium = 1200

// Misc Values
export const MaxPayoutDays = 60
export const MaxEraRewardPointsEras = 10

// Local storage keys
export const FiatCurrencyKey = 'currency'
export const NetworkKey = 'network'
export const ExternalAccountsKey = 'external_accounts'
export const ProviderTypeKey = 'providerType'

export const rpcEndpointKey = (network: string) => `${network}_rpc_endpoints`;
