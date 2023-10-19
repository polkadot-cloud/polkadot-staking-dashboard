// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useHelp } from 'contexts/Help';
import { ErrorFallbackModal } from 'library/ErrorBoundary';
import { Overlay } from '@polkadot-cloud/react';
import { ClaimPayouts } from 'modals/ClaimPayouts';
import { AccountPoolRoles } from '../modals/AccountPoolRoles';
import { Accounts } from '../modals/Accounts';
import { Bio } from '../modals/Bio';
import { Bond } from '../modals/Bond';
import { ChangeNominations } from '../modals/ChangeNominations';
import { ChangePoolRoles } from '../modals/ChangePoolRoles';
import { ChooseLanguage } from '../modals/ChooseLanguage';
import { ClaimReward } from '../modals/ClaimReward';
import { Connect } from '../modals/Connect';
import { GoToFeedback } from '../modals/GoToFeedback';
import { ImportLedger } from '../modals/ImportLedger';
import { ImportVault } from '../modals/ImportVault';
import { JoinPool } from '../modals/JoinPool';
import { ManageFastUnstake } from '../modals/ManageFastUnstake';
import { ManagePool } from '../modals/ManagePool';
import { Networks } from '../modals/Networks';
import { PoolNominations } from '../modals/PoolNominations';
import { Settings } from '../modals/Settings';
import { Unbond } from '../modals/Unbond';
import { UnbondPoolMember } from '../modals/UnbondPoolMember';
import { UnlockChunks } from '../modals/UnlockChunks';
import { Unstake } from '../modals/Unstake';
import { UpdateController } from '../modals/UpdateController';
import { UpdatePayee } from '../modals/UpdatePayee';
import { UpdateReserve } from '../modals/UpdateReserve';
import { ValidatorMetrics } from '../modals/ValidatorMetrics';
import { ValidatorGeo } from '../modals/ValidatorGeo';
import { WithdrawPoolMember } from '../modals/WithdrawPoolMember';
import { ManageNominations } from '../canvas/ManageNominations';

export const Overlays = () => {
  const { status } = useHelp();
  return (
    <Overlay
      fallback={ErrorFallbackModal}
      externalOverlayStatus={status}
      modals={{
        Bio,
        AccountPoolRoles,
        Bond,
        ChangeNominations,
        ChangePoolRoles,
        ChooseLanguage,
        ClaimPayouts,
        ClaimReward,
        Connect,
        Accounts,
        GoToFeedback,
        JoinPool,
        ImportLedger,
        ImportVault,
        ManagePool,
        ManageFastUnstake,
        Networks,
        PoolNominations,
        Settings,
        ValidatorMetrics,
        ValidatorGeo,
        UnbondPoolMember,
        UnlockChunks,
        Unstake,
        UpdateController,
        Unbond,
        UpdatePayee,
        UpdateReserve,
        WithdrawPoolMember,
      }}
      canvas={{
        ManageNominations,
      }}
    />
  );
};
