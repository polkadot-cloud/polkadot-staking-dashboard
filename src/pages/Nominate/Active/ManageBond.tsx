// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { planckBnToUnit, humanNumber } from 'Utils';
import BondedGraph from 'library/Graphs/Bonded';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useBalances } from 'contexts/Balances';
import { useStaking } from 'contexts/Staking';
import { Button, ButtonRow } from 'library/Button';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useModal } from 'contexts/Modal';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import BN from 'bn.js';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useTranslation } from 'react-i18next';

export const ManageBond = () => {
  const { network } = useApi();
  const { units } = network;
  const { openModalWith } = useModal();
  const { activeAccount, isReadOnlyAccount } = useConnect();
  const { getLedgerForStash } = useBalances();
  const { getTransferOptions } = useTransferOptions();
  const { inSetup } = useStaking();
  const { isSyncing } = useUi();
  const ledger = getLedgerForStash(activeAccount);
  const { active }: { active: BN } = ledger;
  const { t } = useTranslation('common');

  const allTransferOptions = getTransferOptions(activeAccount);

  const { freeBalance } = allTransferOptions;
  const { totalUnlocking, totalUnlocked, totalUnlockChuncks } =
    allTransferOptions.nominate;
  const { active: activePool } = allTransferOptions.pool;

  return (
    <>
      <CardHeaderWrapper>
        <h4>
          {t('pages.Nominate.bonded_funds')}
          <OpenHelpIcon helpKey="Bonding" />
        </h4>
        <h2>
          {humanNumber(planckBnToUnit(active, units))}&nbsp;{network.unit}
        </h2>
        <ButtonRow>
          <Button
            small
            primary
            inline
            title="+"
            disabled={
              inSetup() || isSyncing || isReadOnlyAccount(activeAccount)
            }
            onClick={() =>
              openModalWith(
                'UpdateBond',
                { fn: 'add', bondType: 'stake' },
                'small'
              )
            }
          />
          <Button
            small
            primary
            title="-"
            disabled={
              inSetup() || isSyncing || isReadOnlyAccount(activeAccount)
            }
            onClick={() =>
              openModalWith(
                'UpdateBond',
                { fn: 'remove', bondType: 'stake' },
                'small'
              )
            }
          />
          <Button
            small
            inline
            primary
            icon={faLockOpen}
            title={String(totalUnlockChuncks ?? 0)}
            disabled={
              inSetup() || isSyncing || isReadOnlyAccount(activeAccount)
            }
            onClick={() =>
              openModalWith('UnlockChunks', { bondType: 'stake' }, 'small')
            }
          />
        </ButtonRow>
      </CardHeaderWrapper>
      <BondedGraph
        active={planckBnToUnit(active, units)}
        unlocking={planckBnToUnit(totalUnlocking, units)}
        unlocked={planckBnToUnit(totalUnlocked, units)}
        free={planckBnToUnit(freeBalance.sub(activePool), units)}
        inactive={inSetup()}
      />
    </>
  );
};

export default ManageBond;
