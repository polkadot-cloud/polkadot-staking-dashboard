// Copyright 2025 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help'
import { InviteModal } from 'features/invite/components/InviteModal'
import { ErrorFallbackModal } from 'library/ErrorBoundary'
import { Overlay } from 'ui-overlay'
import { CreatePool } from './canvas/CreatePool'
import { ManageNominations } from './canvas/ManageNominations'
import { NominatorSetup } from './canvas/NominatorSetup'
import { Pool } from './canvas/Pool'
import { PoolMembers } from './canvas/PoolMembers'
import { ValidatorMetrics } from './canvas/ValidatorMetrics'
import { Accounts } from './modals/Accounts'
import { Bio } from './modals/Bio'
import { Bond } from './modals/Bond'
import { ChangePoolRoles } from './modals/ChangePoolRoles'
import { ClaimPayouts } from './modals/ClaimPayouts'
import { ClaimReward } from './modals/ClaimReward'
import { DiscordSupport } from './modals/DiscordSupport'
import { ExternalAccounts } from './modals/ExternalAccounts'
import { ImportAccounts } from './modals/ImportAccounts'
import { LeavePool } from './modals/LeavePool'
import { MailSupport } from './modals/MailSupport'
import { ManageFastUnstake } from './modals/ManageFastUnstake'
import { ManagePool } from './modals/ManagePool'
import { Networks } from './modals/Networks'
import { Plugins } from './modals/Plugins'
import { RewardCalculator } from './modals/RewardCalculator'
import { SelectCurrency } from './modals/SelectCurrency'
import { SelectLanguage } from './modals/SelectLanguage'
import { StopNominations } from './modals/StopNominations'
import { Unbond } from './modals/Unbond'
import { UnlockChunks } from './modals/UnlockChunks'
import { Unstake } from './modals/Unstake'
import { UpdatePayee } from './modals/UpdatePayee'
import { UpdateReserve } from './modals/UpdateReserve'

export const Overlays = () => {
  const { status } = useHelp()
  return (
    <Overlay
      fallback={ErrorFallbackModal}
      externalOverlayStatus={status}
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
        LeavePool,
        MailSupport,
        ImportAccounts,
        ManagePool,
        ManageFastUnstake,
        Networks,
        RewardCalculator,
        SelectCurrency,
        Plugins,
        UnlockChunks,
        Unstake,
        Unbond,
        UpdatePayee,
        UpdateReserve,
        InviteModal,
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
