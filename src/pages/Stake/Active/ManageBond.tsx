// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { planckToDot } from '../../../Utils';
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
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { getAccountLedger, getBondedAccount }: any = useBalances();

  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const { active, total } = ledger;

  let { unlocking } = ledger;
  let totalUnlocking = 0;
  for (let i = 0; i < unlocking.length; i++) {
    unlocking[i] = planckToDot(unlocking[i]);
    totalUnlocking += unlocking[i];
  }

  const remaining = total - active - totalUnlocking;

  return (
    <>
      <div className='head'>
        <h4>
          Bonded Funds
          <OpenAssistantIcon page='stake' title='Bonding' />
        </h4>
        <h2>
          {planckToDot(active)} {network.unit} &nbsp;
          <div>
            <Button small primary inline title='+' onClick={() => openModalWith('UpdateBond', { fn: 'add' }, 'small')} />
            <Button small primary title='-' onClick={() => openModalWith('UpdateBond', { fn: 'remove' }, 'small')} />
          </div>
        </h2>
      </div>

      <GraphWrapper transparent noMargin>
        <div className='graph' style={{ flex: 0, paddingRight: '1rem', height: 160 }}>
          <BondedGraph
            active={planckToDot(active)}
            unlocking={planckToDot(totalUnlocking)}
            remaining={planckToDot(remaining)}
            total={total}
          />
        </div>
      </GraphWrapper>
    </>
  )
}

export default ManageBond;