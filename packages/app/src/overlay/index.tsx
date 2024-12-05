// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help'
import { Overlay } from 'kits/Overlay'
import { ErrorFallbackModal } from 'library/ErrorBoundary'
import { CreatePool } from './canvas/CreatePool'
import { JoinPool } from './canvas/JoinPool'
import { ManageNominations } from './canvas/ManageNominations'
import { NominatorSetup } from './canvas/NominatorSetup'
import { PoolMembers } from './canvas/PoolMembers'
import { Accounts } from './modals/Accounts'
import { Bio } from './modals/Bio'
import { Bond } from './modals/Bond'
import { ChangePoolRoles } from './modals/ChangePoolRoles'
import { ChooseLanguage } from './modals/ChooseLanguage'
import { ClaimPayouts } from './modals/ClaimPayouts'
import { ClaimReward } from './modals/ClaimReward'
import { Connect } from './modals/Connect'
import { DiscordSupport } from './modals/DiscordSupport'
import { ImportLedger } from './modals/ImportLedger'
import { ImportVault } from './modals/ImportVault'
import { ImportWalletConnect } from './modals/ImportWalletConnect'
import { MailSupport } from './modals/MailSupport'
import { ManageFastUnstake } from './modals/ManageFastUnstake'
import { ManagePool } from './modals/ManagePool'
import { Networks } from './modals/Networks'
import { Settings } from './modals/Settings'
import { StopNominations } from './modals/StopNominations'
import { Unbond } from './modals/Unbond'
import { UnlockChunks } from './modals/UnlockChunks'
import { Unstake } from './modals/Unstake'
import { UpdatePayee } from './modals/UpdatePayee'
import { UpdateReserve } from './modals/UpdateReserve'
import { ValidatorGeo } from './modals/ValidatorGeo'
import { ValidatorMetrics } from './modals/ValidatorMetrics'

export const Overlays = () => {
  const { status } = useHelp()
  return (
    <Overlay
      fallback={ErrorFallbackModal}
      externalOverlayStatus={status}
      modals={{
        Bio,
        Bond,
        StopNominations,
        ChangePoolRoles,
        ChooseLanguage,
        ClaimPayouts,
        ClaimReward,
        Connect,
        Accounts,
        DiscordSupport,
        MailSupport,
        ImportLedger,
        ImportVault,
        ImportWalletConnect,
        ManagePool,
        ManageFastUnstake,
        Networks,
        Settings,
        ValidatorMetrics,
        ValidatorGeo,
        UnlockChunks,
        Unstake,
        Unbond,
        UpdatePayee,
        UpdateReserve,
      }}
      canvas={{
        ManageNominations,
        PoolMembers,
        JoinPool,
        CreatePool,
        NominatorSetup,
      }}
    />
  )
}
