// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { useConnect } from 'contexts/Connect';
import { planckBnToUnit, humanNumber } from 'Utils';
import BondedGraph from 'library/Graphs/Bonded';
import { useApi } from 'contexts/Api';
import { Button, ButtonRow } from 'library/Button';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useModal } from 'contexts/Modal';
import { useUi } from 'contexts/UI';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { PoolState } from 'contexts/Pools/types';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useTransferOptions } from 'contexts/TransferOptions';

export const ManageBond = () => {
  const { network } = useApi();
  const { units } = network;
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { isSyncing } = useUi();
  const { membership } = usePoolMemberships();
  const { isBonding, selectedActivePool } = useActivePools();
  const { getTransferOptions } = useTransferOptions();

  const allTransferOptions = getTransferOptions(activeAccount);
  const { freeBalance } = allTransferOptions;
  const { active, totalUnlocking, totalUnlocked, totalUnlockChuncks } =
    allTransferOptions.pool;

  const { state } = selectedActivePool?.bondedPool || {};

  return (
    <>
      <CardHeaderWrapper>
        <h4>
          Bonded Funds
          <OpenHelpIcon helpKey="Bonded in Pool" />
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
            disabled={isSyncing || !isBonding() || state === PoolState.Destroy}
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
            disabled={isSyncing || !isBonding() || state === PoolState.Destroy}
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
            disabled={isSyncing || !membership || state === PoolState.Destroy}
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
        free={planckBnToUnit(freeBalance, units)}
        inactive={!membership}
      />
    </>
  );
};

export default ManageBond;
