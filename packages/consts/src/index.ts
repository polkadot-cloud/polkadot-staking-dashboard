// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

// Global Constants
export const DappName = 'Polkadot Cloud Staking'
export const DappOrganisation = 'Polkadot Cloud'
export const PlatformURL = 'https://polkadot.cloud'
export const PlatformDocsURL = 'https://docs.staking.polkadot.cloud'
export const PlatformPrivacyURL = 'https://polkadot.cloud/privacy'
export const PlatformDisclaimerURL = 'https://polkadot.cloud/disclaimer'
export const PlatformSupportEmail = 'staking@polkadot.cloud'
export const DiscordSupportURL = 'https://discord.gg/QY7CSSJm3D'

export const ManualSigners = ['ledger', 'vault', 'wallet_connect']
export const GitHubURl =
	'https://github.com/polkadot-cloud/polkadot-staking-dashboard'

// Analytics
export const SAEnabled = false

// Element Thresholds
export const SideMenuHiddenWidth = 250
export const SideMenuMaximisedWidth = 145
export const SideMenuMinimisedWidth = 75
export const SectionFullWidthThreshold = 1000
export const PageWidthMediumThreshold = 1150
export const SmallFontSizeMaxWidth = 600
export const TipsThresholdSmall = 750
export const TipsThresholdMedium = 1200

// Misc Values
export const MaxNominations = 16
export const MaxPayoutDays = 60
export const MaxEraRewardPointsEras = 10
export const PerbillMultiplier = 10000000
export const ToastDelayDuration = 3000
export const MaximumPayoutDays = 60
export const SyncTimeoutDuration = 10000

// Local storage keys
export const FiatCurrencyKey = 'currency'
export const NetworkKey = 'network'
export const ExternalAccountsKey = 'external_accounts'
export const ProviderTypeKey = 'providerType'
export const AutoRpcKey = 'autoRpc'
export const PoolSetupsKey = 'poolSetups'
export const NominatorSetupsKey = 'nominatorSetups'
export const AdvancedModeKey = 'advancedMode'
export const ShowHelpKey = 'showHelp'
export const ActiveProxiesKey = 'activeProxies'
export const ActivePagesKey = 'activePages'

export const rpcEndpointKey = (network: string) => `${network}RpcEndpoints`
export const rpcHealthCacheKey = (network: string) => `${network}RpcHealth`
