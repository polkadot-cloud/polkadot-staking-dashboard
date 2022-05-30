// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from 'contexts/Connect';
import { useBalances } from 'contexts/Balances';
import { planckBnToUnit } from '../../Utils';
import BondedGraph from '../../library/Graphs/Bonded';
import { useApi } from '../../contexts/Api';
import { useStaking } from '../../contexts/Staking';
import { Button, ButtonRow } from '../../library/Button';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';
import { useModal } from '../../contexts/Modal';
import { useUi } from '../../contexts/UI';
import { usePools } from '../../contexts/Pools';
import { SectionHeaderWrapper } from '../../library/Graphs/Wrappers';
import { APIContextInterface } from '../../types/api';

export const ManageBond = () => {
  const { network } = useApi() as APIContextInterface;
  const { units } = network;
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { inSetup } = useStaking();
  const { isSyncing } = useUi();
  const { getAccountLedger }: any = useBalances();
  const { getPoolBondOptions, isBonding } = usePools();
  const ledger = getAccountLedger(activeAccount);
  const { total }: any = ledger;

  const {
    active,
    freeToBond,
    totalUnlocking,
    totalUnlocked,
    totalUnlockChuncks,
  } = getPoolBondOptions(activeAccount);

  return (
    <>
      <SectionHeaderWrapper>
        <h4>
          Bonded Funds
          <OpenAssistantIcon page="pools" title="Bonded in Pool" />
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
            disabled={isSyncing || !isBonding()}
            onClick={() =>
              openModalWith(
                'UpdateBond',
                { fn: 'add', target: 'pool' },
                'small'
              )
            }
          />
          <Button
            small
            primary
            title="-"
            disabled={isSyncing || !isBonding()}
            onClick={() =>
              openModalWith(
                'UpdateBond',
                { fn: 'remove', target: 'pool' },
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
            disabled={isSyncing || !isBonding()}
            onClick={() => console.log('TODO: Manage Pool Unlocks')}
          />
        </ButtonRow>
      </SectionHeaderWrapper>
      <BondedGraph
        active={planckBnToUnit(active, units)}
        unlocking={totalUnlocking}
        unlocked={totalUnlocked}
        free={freeToBond}
        total={total.toNumber()}
        inactive={inSetup()}
      />
    </>
  );
};

export default ManageBond;
