// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useModal } from 'contexts/Modal';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { PoolState } from 'contexts/Pools/types';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { ButtonRow } from 'library/Button';
import BondedGraph from 'library/Graphs/Bonded';
import { CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { humanNumber, planckBnToUnit } from 'Utils';

export const ManageBond = () => {
  const { network } = useApi();
  const { units } = network;
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { poolsSyncing } = useUi();
  const { isBonding, isMember, selectedActivePool } = useActivePools();
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
        <ButtonRow verticalSpacing>
          <ButtonPrimary
            disabled={
              poolsSyncing ||
              !isBonding() ||
              !isMember() ||
              state === PoolState.Destroy
            }
            marginRight
            onClick={() =>
              openModalWith(
                'UpdateBond',
                { fn: 'add', bondType: 'pool' },
                'small'
              )
            }
            text="+"
          />
          <ButtonPrimary
            disabled={
              poolsSyncing ||
              !isBonding() ||
              !isMember() ||
              state === PoolState.Destroy
            }
            marginRight
            onClick={() =>
              openModalWith(
                'UpdateBond',
                { fn: 'remove', bondType: 'pool' },
                'small'
              )
            }
            text="-"
          />
          <ButtonPrimary
            disabled={
              poolsSyncing || !isMember() || state === PoolState.Destroy
            }
            iconLeft={faLockOpen}
            onClick={() =>
              openModalWith('UnlockChunks', { bondType: 'pool' }, 'small')
            }
            text={String(totalUnlockChuncks ?? 0)}
          />
        </ButtonRow>
      </CardHeaderWrapper>
      <BondedGraph
        active={planckBnToUnit(active, units)}
        unlocking={planckBnToUnit(totalUnlocking, units)}
        unlocked={planckBnToUnit(totalUnlocked, units)}
        free={planckBnToUnit(freeBalance, units)}
        inactive={!isMember()}
      />
    </>
  );
};

export default ManageBond;
