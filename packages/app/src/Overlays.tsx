// Copyright 2026 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { ErrorFallbackModal } from 'library/ErrorBoundary'
import { lazy } from 'react'
import { Overlay } from 'ui-overlay'

const CreatePool = lazy(() =>
	import('canvas/CreatePool').then((m) => ({ default: m.CreatePool })),
)
const ManageNominations = lazy(() =>
	import('canvas/ManageNominations').then((m) => ({
		default: m.ManageNominations,
	})),
)
const NominatorSetup = lazy(() =>
	import('canvas/NominatorSetup').then((m) => ({ default: m.NominatorSetup })),
)
const Pool = lazy(() =>
	import('canvas/Pool').then((m) => ({ default: m.Pool })),
)
const PoolMembers = lazy(() =>
	import('canvas/PoolMembers').then((m) => ({ default: m.PoolMembers })),
)
const ValidatorMetrics = lazy(() =>
	import('canvas/ValidatorMetrics').then((m) => ({
		default: m.ValidatorMetrics,
	})),
)

const Accounts = lazy(() =>
	import('modals/Accounts').then((m) => ({ default: m.Accounts })),
)
const Bio = lazy(() => import('modals/Bio').then((m) => ({ default: m.Bio })))
const Bond = lazy(() =>
	import('modals/Bond').then((m) => ({ default: m.Bond })),
)
const ChangePoolRoles = lazy(() =>
	import('modals/ChangePoolRoles').then((m) => ({
		default: m.ChangePoolRoles,
	})),
)
const ClaimPayouts = lazy(() =>
	import('modals/ClaimPayouts').then((m) => ({ default: m.ClaimPayouts })),
)
const ClaimReward = lazy(() =>
	import('modals/ClaimReward').then((m) => ({ default: m.ClaimReward })),
)
const DiscordSupport = lazy(() =>
	import('modals/DiscordSupport').then((m) => ({ default: m.DiscordSupport })),
)
const ExternalAccounts = lazy(() =>
	import('modals/ExternalAccounts').then((m) => ({
		default: m.ExternalAccounts,
	})),
)
const ImportAccounts = lazy(() =>
	import('modals/ImportAccounts').then((m) => ({ default: m.ImportAccounts })),
)
const Invite = lazy(() =>
	import('modals/Invite').then((m) => ({ default: m.Invite })),
)
const JoinPool = lazy(() =>
	import('modals/JoinPool').then((m) => ({ default: m.JoinPool })),
)
const LeavePool = lazy(() =>
	import('modals/LeavePool').then((m) => ({ default: m.LeavePool })),
)
const MailSupport = lazy(() =>
	import('modals/MailSupport').then((m) => ({ default: m.MailSupport })),
)
const ManagePool = lazy(() =>
	import('modals/ManagePool').then((m) => ({ default: m.ManagePool })),
)
const Networks = lazy(() =>
	import('modals/Networks').then((m) => ({ default: m.Networks })),
)
const Plugins = lazy(() =>
	import('modals/Plugins').then((m) => ({ default: m.Plugins })),
)
const RewardCalculator = lazy(() =>
	import('modals/RewardCalculator').then((m) => ({
		default: m.RewardCalculator,
	})),
)
const SelectCurrency = lazy(() =>
	import('modals/SelectCurrency').then((m) => ({ default: m.SelectCurrency })),
)
const SelectLanguage = lazy(() =>
	import('modals/SelectLanguage').then((m) => ({ default: m.SelectLanguage })),
)
const SetController = lazy(() =>
	import('modals/SetController').then((m) => ({ default: m.SetController })),
)
const SimpleNominate = lazy(() =>
	import('modals/SimpleNominate').then((m) => ({ default: m.SimpleNominate })),
)
const StakingOptions = lazy(() =>
	import('modals/StakingOptions').then((m) => ({ default: m.StakingOptions })),
)
const StopNominations = lazy(() =>
	import('modals/StopNominations').then((m) => ({
		default: m.StopNominations,
	})),
)
const SyncAccounts = lazy(() =>
	import('modals/SyncAccounts').then((m) => ({ default: m.SyncAccounts })),
)
const Transfer = lazy(() =>
	import('modals/Transfer').then((m) => ({ default: m.Transfer })),
)
const Unbond = lazy(() =>
	import('modals/Unbond').then((m) => ({ default: m.Unbond })),
)
const UnlockChunks = lazy(() =>
	import('modals/UnlockChunks').then((m) => ({ default: m.UnlockChunks })),
)
const Unstake = lazy(() =>
	import('modals/Unstake').then((m) => ({ default: m.Unstake })),
)
const UpdatePayee = lazy(() =>
	import('modals/UpdatePayee').then((m) => ({ default: m.UpdatePayee })),
)
const UpdateReserve = lazy(() =>
	import('modals/UpdateReserve').then((m) => ({ default: m.UpdateReserve })),
)

export const Overlays = () => {
	return (
		<Overlay
			fallback={ErrorFallbackModal}
			externalOverlayStatus="closed"
			modals={{
				Bio,
				Bond,
				ExternalAccounts,
				StopNominations,
				ChangePoolRoles,
				SelectLanguage,
				ClaimPayouts,
				ClaimReward,
				Accounts,
				DiscordSupport,
				JoinPool,
				LeavePool,
				MailSupport,
				ImportAccounts,
				Invite,
				ManagePool,
				Networks,
				RewardCalculator,
				SelectCurrency,
				SetController,
				StakingOptions,
				SimpleNominate,
				SyncAccounts,
				Transfer,
				Plugins,
				UnlockChunks,
				Unstake,
				Unbond,
				UpdatePayee,
				UpdateReserve,
			}}
			canvas={{
				ManageNominations,
				PoolMembers,
				Pool,
				CreatePool,
				NominatorSetup,
				ValidatorMetrics,
			}}
		/>
	)
}
