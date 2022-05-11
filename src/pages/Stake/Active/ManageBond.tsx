// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { planckToUnit } from '../../../Utils';
import BondedGraph from './BondedGraph';
import { useApi } from '../../../contexts/Api';
import { useConnect } from '../../../contexts/Connect';
import { useBalances } from '../../../contexts/Balances';
import { Button } from '../../../library/Button';
import { GraphWrapper } from '../../../library/Graphs/Wrappers';
import { OpenAssistantIcon } from '../../../library/OpenAssistantIcon';
import { useModal } from '../../../contexts/Modal';

export const ManageBond = () => {

  const { network }: any = useApi();
  const { units } = network;
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { getAccountLedger, getBondedAccount }: any = useBalances();

  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const { active, total } = ledger;

  let { unlocking } = ledger;
  let totalUnlocking = 0;
  for (let i = 0; i < unlocking.length; i++) {
    unlocking[i] = planckToUnit(unlocking[i].toNumber(), units);
    totalUnlocking += unlocking[i];
  }

  const remaining = total.sub(active).toNumber() - totalUnlocking;

  return (
    <>
      <div className='head'>
        <h4>
          Bonded Funds
          <OpenAssistantIcon page='stake' title='Bonding' />
        </h4>
        <h2>
          {planckToUnit(active.toNumber(), units)} {network.unit} &nbsp;
          <div>
            <Button small primary inline title='+' onClick={() => openModalWith('UpdateBond', { fn: 'add' }, 'small')} />
            <Button small primary title='-' onClick={() => openModalWith('UpdateBond', { fn: 'remove' }, 'small')} />
          </div>
        </h2>
      </div>

      <GraphWrapper transparent noMargin>
        <div className='graph' style={{ flex: 0, paddingRight: '1rem', height: 160 }}>
          <BondedGraph
            active={planckToUnit(active.toNumber(), units)}
            unlocking={planckToUnit(totalUnlocking, units)}
            remaining={planckToUnit(remaining, units)}
            total={total.toNumber()}
          />
        </div>
      </GraphWrapper>
    </>
  )
}

export default ManageBond;