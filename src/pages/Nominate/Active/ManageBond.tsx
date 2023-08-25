// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { ButtonHelp, ButtonPrimary, ButtonRow } from '@polkadot-cloud/react';
import { planckToUnit } from '@polkadot-cloud/utils';
import type BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { useHelp } from 'contexts/Help';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper } from 'library/Card/Wrappers';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { BondedChart } from '../../../library/BarChart/BondedChart';

export const ManageBond = () => {
  const { t } = useTranslation('pages');
  const { network } = useApi();
  const { openModal } = useOverlay().modal;
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { getStashLedger } = useBalances();
  const { getTransferOptions } = useTransferOptions();
  const { inSetup } = useStaking();
  const { isSyncing } = useUi();
  const { isFastUnstaking } = useUnstaking();
  const { openHelp } = useHelp();

  const { units } = network;
  const ledger = getStashLedger(activeAccount);
  const { active }: { active: BigNumber } = ledger;
  const allTransferOptions = getTransferOptions(activeAccount);

  const { freeBalance } = allTransferOptions;
  const { totalUnlocking, totalUnlocked, totalUnlockChuncks } =
    allTransferOptions.nominate;

  return (
    <>
      <CardHeaderWrapper>
        <h4>
          {t('nominate.bondedFunds')}
          <ButtonHelp marginLeft onClick={() => openHelp('Bonding')} />
        </h4>
        <h2>{`${planckToUnit(active, units).toFormat()} ${network.unit}`}</h2>
        <ButtonRow>
          <ButtonPrimary
            disabled={
              inSetup() ||
              isSyncing ||
              isReadOnlyAccount(activeAccount) ||
              isFastUnstaking
            }
            marginRight
            onClick={() =>
              openModal({
                key: 'Bond',
                options: { bondFor: 'nominator' },
                size: 'small',
              })
            }
            text="+"
          />
          <ButtonPrimary
            disabled={
              inSetup() ||
              isSyncing ||
              isReadOnlyAccount(activeAccount) ||
              isFastUnstaking
            }
            marginRight
            onClick={() =>
              openModal({
                key: 'Unbond',
                options: { bondFor: 'nominator' },
                size: 'small',
              })
            }
            text="-"
          />
          <ButtonPrimary
            disabled={
              isSyncing || inSetup() || isReadOnlyAccount(activeAccount)
            }
            iconLeft={faLockOpen}
            marginRight
            onClick={() =>
              openModal({
                key: 'UnlockChunks',
                options: { bondFor: 'nominator', disableWindowResize: true },
                size: 'small',
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
        free={planckToUnit(freeBalance, units)}
        inactive={active.isZero()}
      />
    </>
  );
};
