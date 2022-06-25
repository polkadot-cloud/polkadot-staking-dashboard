// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from 'contexts/Connect';
import { planckBnToUnit, humanNumber } from 'Utils';
import BondedGraph from 'library/Graphs/Bonded';
import { useApi } from 'contexts/Api';
import { Button, ButtonRow } from 'library/Button';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { useModal } from 'contexts/Modal';
import { useUi } from 'contexts/UI';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { ActivePoolContextState } from 'types/pools';

export const ManageBond = () => {
  const { network } = useApi() as APIContextInterface;
  const { units } = network;
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { isSyncing } = useUi();
  const { getPoolBondOptions, isBonding } =
    useActivePool() as ActivePoolContextState;

  const {
    active,
    freeToBond,
    totalUnlocking,
    totalUnlocked,
    totalUnlockChuncks,
  } = getPoolBondOptions(activeAccount);

  return (
    <>
      <CardHeaderWrapper>
        <h4>
          Bonded Funds
          <OpenAssistantIcon page="pools" title="Bonded in Pool" />
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
            disabled={isSyncing || !isBonding()}
            onClick={() =>
              openModalWith(
                'UpdateBond',
                { fn: 'add', bondType: 'pool' },
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
                { fn: 'remove', bondType: 'pool' },
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
            onClick={() =>
              openModalWith('UnlockChunks', { bondType: 'pool' }, 'small')
            }
          />
        </ButtonRow>
      </CardHeaderWrapper>
      <BondedGraph
        active={planckBnToUnit(active, units)}
        unlocking={planckBnToUnit(totalUnlocking, units)}
        unlocked={planckBnToUnit(totalUnlocked, units)}
        free={planckBnToUnit(freeToBond, units)}
        inactive={!isBonding()}
      />
    </>
  );
};

export default ManageBond;
