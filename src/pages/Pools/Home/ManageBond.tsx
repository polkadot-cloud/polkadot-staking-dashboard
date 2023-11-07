// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import {
  ButtonHelp,
  ButtonPrimary,
  ButtonRow,
  Odometer,
} from '@polkadot-cloud/react';
import { minDecimalPlaces, planckToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { BondedChart } from 'library/BarChart/BondedChart';
import { CardHeaderWrapper } from 'library/Card/Wrappers';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';

export const ManageBond = () => {
  const { t } = useTranslation('pages');

  const {
    networkData: {
      units,
      brand: { token: Token },
    },
  } = useNetwork();
  const { openHelp } = useHelp();
  const { isPoolSyncing } = useUi();
  const { openModal } = useOverlay().modal;
  const { activeAccount } = useActiveAccounts();
  const { isReadOnlyAccount } = useImportedAccounts();
  const { getTransferOptions } = useTransferOptions();
  const { isBonding, isMember, selectedActivePool } = useActivePools();

  const allTransferOptions = getTransferOptions(activeAccount);
  const {
    pool: { active, totalUnlocking, totalUnlocked, totalUnlockChunks },
    transferrableBalance,
  } = allTransferOptions;

  const { state } = selectedActivePool?.bondedPool || {};

  return (
    <>
      <CardHeaderWrapper>
        <h4>
          {t('pools.bondedFunds')}
          <ButtonHelp marginLeft onClick={() => openHelp('Bonded in Pool')} />
        </h4>
        <h2>
          <Token className="networkIcon" />
          <Odometer
            value={minDecimalPlaces(planckToUnit(active, units).toFormat(), 2)}
            zeroDecimals={2}
          />
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
                options: {
                  bondFor: 'pool',
                  disableWindowResize: true,
                  disableScroll: true,
                },
                size: 'sm',
              })
            }
            text={String(totalUnlockChunks ?? 0)}
          />
        </ButtonRow>
      </CardHeaderWrapper>
      <BondedChart
        active={planckToUnit(active, units)}
        unlocking={planckToUnit(totalUnlocking, units)}
        unlocked={planckToUnit(totalUnlocked, units)}
        free={planckToUnit(transferrableBalance, units)}
        inactive={active.isZero()}
      />
    </>
  );
};
