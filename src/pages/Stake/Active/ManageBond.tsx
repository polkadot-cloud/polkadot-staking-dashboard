// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { planckBnToUnit } from '../../../Utils';
import BondedGraph from './BondedGraph';
import { useApi } from '../../../contexts/Api';
import { useConnect } from '../../../contexts/Connect';
import { useBalances } from '../../../contexts/Balances';
import { useStaking } from '../../../contexts/Staking';
import { Button, ButtonRow } from '../../../library/Button';
import { OpenAssistantIcon } from '../../../library/OpenAssistantIcon';
import { useModal } from '../../../contexts/Modal';
import { useUi } from '../../../contexts/UI';

export const ManageBond = () => {
  const { network }: any = useApi();
  const { units } = network;
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { getAccountLedger, getBondedAccount, getBondOptions }: any =
    useBalances();
  const { inSetup } = useStaking();
  const { isSyncing } = useUi();
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const { active, total } = ledger;
  const { freeToBond, totalUnlocking, totalUnlockChuncks } =
    getBondOptions(activeAccount);

  return (
    <>
      <div className="head">
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
            onClick={() => openModalWith('UpdateBond', { fn: 'add' }, 'small')}
          />
          <Button
            small
            primary
            title="-"
            disabled={inSetup() || isSyncing}
            onClick={() =>
              openModalWith('UpdateBond', { fn: 'remove' }, 'small')
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
      </div>
      <BondedGraph
        active={planckBnToUnit(active, units)}
        unlocking={totalUnlocking}
        free={freeToBond}
        total={total.toNumber()}
        inactive={inSetup()}
      />
    </>
  );
};

export default ManageBond;
