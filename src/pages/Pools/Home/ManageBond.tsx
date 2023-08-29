// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import {
  ButtonHelp,
  ButtonPrimary,
  ButtonRow,
  Odometer,
} from '@polkadot-cloud/react';
import { planckToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useHelp } from 'contexts/Help';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { BondedChart } from 'library/BarChart/BondedChart';
import { CardHeaderWrapper } from 'library/Card/Wrappers';
import { useOverlay } from '@polkadot-cloud/react/hooks';

export const ManageBond = () => {
  const { t } = useTranslation('pages');

  const { network } = useApi();
  const { openHelp } = useHelp();
  const { isPoolSyncing } = useUi();
  const { openModal } = useOverlay().modal;
  const { getTransferOptions } = useTransferOptions();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { isBonding, isMember, selectedActivePool } = useActivePools();
  const { units } = network;

  const allTransferOptions = getTransferOptions(activeAccount);
  const {
    active,
    totalUnlocking,
    totalUnlocked,
    totalUnlockChuncks,
    totalAdditionalBond,
  } = allTransferOptions.pool;

  const { state } = selectedActivePool?.bondedPool || {};

  return (
    <>
      <CardHeaderWrapper>
        <h4>
          {t('pools.bondedFunds')}
          <ButtonHelp marginLeft onClick={() => openHelp('Bonded in Pool')} />
        </h4>
        <h2>
          <Odometer value={planckToUnit(active, units).toFormat()} />
          {network.unit}
        </h2>
        <ButtonRow>
          <ButtonPrimary
            disabled={
              isPoolSyncing ||
              !isBonding() ||
              !isMember() ||
              isReadOnlyAccount(activeAccount) ||
              state === 'Destroying'
            }
            marginRight
            onClick={() =>
              openModal({
                key: 'Bond',
                options: { bondFor: 'pool' },
                size: 'sm',
              })
            }
            text="+"
          />
          <ButtonPrimary
            disabled={
              isPoolSyncing ||
              !isBonding() ||
              !isMember() ||
              isReadOnlyAccount(activeAccount) ||
              state === 'Destroying'
            }
            marginRight
            onClick={() =>
              openModal({
                key: 'Unbond',
                options: { bondFor: 'pool' },
                size: 'sm',
              })
            }
            text="-"
          />
          <ButtonPrimary
            disabled={
              isPoolSyncing || !isMember() || isReadOnlyAccount(activeAccount)
            }
            iconLeft={faLockOpen}
            onClick={() =>
              openModal({
                key: 'UnlockChunks',
                options: { bondFor: 'pool', disableWindowResize: true },
                size: 'sm',
              })
            }
            text={String(totalUnlockChuncks ?? 0)}
          />
        </ButtonRow>
      </CardHeaderWrapper>
      <BondedChart
        active={planckToUnit(active, units)}
        unlocking={planckToUnit(totalUnlocking, units)}
        unlocked={planckToUnit(totalUnlocked, units)}
        free={planckToUnit(totalAdditionalBond, units)}
        inactive={active.isZero()}
      />
    </>
  );
};
