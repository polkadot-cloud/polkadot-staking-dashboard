// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { planckBnToUnit } from 'Utils';
import BondedGraph from 'library/Graphs/Bonded';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useBalances } from 'contexts/Balances';
import { useStaking } from 'contexts/Staking';
import { Button, ButtonRow } from 'library/Button';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { useModal } from 'contexts/Modal';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { BalancesContextInterface, BondOptions } from 'types/balances';
import BN from 'bn.js';
import { StakingContextInterface } from 'types/staking';

export const ManageBond = () => {
  const { network } = useApi() as APIContextInterface;
  const { units } = network;
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { getAccountLedger, getBondOptions } =
    useBalances() as BalancesContextInterface;
  const { inSetup } = useStaking() as StakingContextInterface;
  const { isSyncing } = useUi();
  const ledger = getAccountLedger(activeAccount);
  const { active, total }: { active: BN; total: BN } = ledger;
  const {
    freeToBond,
    totalUnlocking,
    totalUnlocked,
    totalUnlockChuncks,
  }: BondOptions = getBondOptions(activeAccount);

  return (
    <>
      <CardHeaderWrapper>
        <h4>
          Bonded Funds
          <OpenAssistantIcon page="stake" title="Bonding" />
        </h4>
        <h2>
          {planckBnToUnit(active, units)}&nbsp;{network.unit}
        </h2>
        <ButtonRow>
          <Button
            small
            primary
            inline
            title="+"
            disabled={inSetup() || isSyncing}
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
            disabled={inSetup() || isSyncing}
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
            disabled={inSetup() || isSyncing}
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
        free={planckBnToUnit(freeToBond, units)}
        total={planckBnToUnit(total, units)}
        inactive={inSetup()}
      />
    </>
  );
};

export default ManageBond;
