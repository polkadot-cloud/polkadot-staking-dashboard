// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { Odometer } from '@w3ux/react-odometer';
import { minDecimalPlaces } from '@w3ux/utils';
import type BigNumber from 'bignumber.js';
import { useTranslation } from 'react-i18next';
import { useBalances } from 'contexts/Balances';
import { useHelp } from 'contexts/Help';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { CardHeaderWrapper } from 'library/Card/Wrappers';
import { useUnstaking } from 'hooks/useUnstaking';
import { useOverlay } from 'kits/Overlay/Provider';
import { BondedChart } from 'library/BarChart/BondedChart';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useImportedAccounts } from 'contexts/Connect/ImportedAccounts';
import { useSyncing } from 'hooks/useSyncing';
import { ButtonHelp } from 'ui-buttons';
import { ButtonPrimary } from 'ui-buttons';
import { ButtonRow } from 'kits/Structure/ButtonRow';
import { planckToUnitBn } from 'library/Utils';

export const ManageBond = () => {
  const { t } = useTranslation('pages');
  const {
    networkData: {
      units,
      brand: { token: Token },
    },
  } = useNetwork();
  const { openHelp } = useHelp();
  const { syncing } = useSyncing();
  const { inSetup } = useStaking();
  const { getLedger } = useBalances();
  const { openModal } = useOverlay().modal;
  const { isFastUnstaking } = useUnstaking();
  const { isReadOnlyAccount } = useImportedAccounts();
  const { getTransferOptions } = useTransferOptions();
  const { activeAccount } = useActiveAccounts();
  const ledger = getLedger({ stash: activeAccount });
  const { active }: { active: BigNumber } = ledger;
  const allTransferOptions = getTransferOptions(activeAccount);

  const { freeBalance } = allTransferOptions;
  const { totalUnlocking, totalUnlocked, totalUnlockChunks } =
    allTransferOptions.nominate;

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
            value={minDecimalPlaces(
              planckToUnitBn(active, units).toFormat(),
              2
            )}
            zeroDecimals={2}
          />
        </h2>
        <ButtonRow>
          <ButtonPrimary
            disabled={
              inSetup() ||
              syncing ||
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
              syncing ||
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
            disabled={syncing || inSetup() || isReadOnlyAccount(activeAccount)}
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
        active={planckToUnitBn(active, units)}
        unlocking={planckToUnitBn(totalUnlocking, units)}
        unlocked={planckToUnitBn(totalUnlocked, units)}
        free={planckToUnitBn(freeBalance, units)}
        inactive={active.isZero()}
      />
    </>
  );
};
