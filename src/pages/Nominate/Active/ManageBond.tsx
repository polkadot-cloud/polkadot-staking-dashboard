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
import BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useBalances } from 'contexts/Balances';
import { useHelp } from 'contexts/Help';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper } from 'library/Card/Wrappers';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { BondedChart } from 'library/BarChart/BondedChart';
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
  const { isSyncing } = useUi();
  const { openHelp } = useHelp();
  const { inSetup } = useStaking();
  const { openModal } = useOverlay().modal;
  const { getStashLedger } = useBalances();
  const { isFastUnstaking } = useUnstaking();
  const { isReadOnlyAccount } = useImportedAccounts();
  const { getTransferOptions, feeReserve } = useTransferOptions();
  const { activeAccount } = useActiveAccounts();
  const ledger = getStashLedger(activeAccount);
  const { active }: { active: BigNumber } = ledger;
  const allTransferOptions = getTransferOptions(activeAccount);

  const { freeBalance, edReserved } = allTransferOptions;
  const { totalUnlocking, totalUnlocked, totalUnlockChunks } =
    allTransferOptions.nominate;
  const totalFree = BigNumber.max(
    0,
    freeBalance.minus(edReserved.plus(feeReserve))
  );

  return (
    <>
      <CardHeaderWrapper>
        <h4>
          {t('nominate.bondedFunds')}
          <ButtonHelp marginLeft onClick={() => openHelp('Bonding')} />
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
                size: 'sm',
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
                size: 'sm',
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
                options: {
                  bondFor: 'nominator',
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
        free={planckToUnit(totalFree, units)}
        inactive={active.isZero()}
      />
    </>
  );
};
