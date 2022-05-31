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
import { SectionHeaderWrapper } from 'library/Graphs/Wrappers';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';

export const ManageBond = () => {
  const { network } = useApi() as APIContextInterface;
  const { units } = network;
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { getAccountLedger, getBondOptions }: any = useBalances();
  const { inSetup } = useStaking();
  const { isSyncing } = useUi();
  const ledger = getAccountLedger(activeAccount);
  const { active, total } = ledger;
  const { freeToBond, totalUnlocking, totalUnlocked, totalUnlockChuncks } =
    getBondOptions(activeAccount);

  return (
    <>
      <SectionHeaderWrapper>
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
                { fn: 'add', target: 'stake' },
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
                { fn: 'remove', target: 'stake' },
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
            onClick={() => openModalWith('UnlockChunks', {}, 'small')}
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
