// Copyright 2024 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { ButtonRow, Odometer } from '@polkadot-cloud/react';
import { minDecimalPlaces, planckToUnit } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useTransferOptions } from 'contexts/TransferOptions';
import { BondedChart } from 'library/BarChart/BondedChart';
import { CardHeaderWrapper } from 'library/Card/Wrappers';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useSyncing } from 'hooks/useSyncing';
import { ButtonHelp } from 'kits/Buttons/ButtonHelp';
import { ButtonPrimary } from 'kits/Buttons/ButtonPrimary';

export const ManageBond = () => {
  const { t } = useTranslation('pages');

  const {
    networkData: {
      units,
      brand: { token: Token },
    },
  } = useNetwork();
  const { openHelp } = useHelp();
  const { openModal } = useOverlay().modal;
  const { activeAccount } = useActiveAccounts();
  const { syncing } = useSyncing(['active-pools']);
  const { isReadOnlyAccount } = useImportedAccounts();
  const { getTransferOptions } = useTransferOptions();
  const { isBonding, isMember, activePool } = useActivePool();

  const allTransferOptions = getTransferOptions(activeAccount);
  const {
    pool: { active, totalUnlocking, totalUnlocked, totalUnlockChunks },
    transferrableBalance,
  } = allTransferOptions;

  const { state } = activePool?.bondedPool || {};

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
              syncing ||
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
              syncing ||
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
              syncing || !isMember() || isReadOnlyAccount(activeAccount)
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
