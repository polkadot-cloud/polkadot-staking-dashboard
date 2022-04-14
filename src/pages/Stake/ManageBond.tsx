// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { planckToDot } from '../../Utils';
import BondedGraph from './BondedGraph';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { useBalances } from '../../contexts/Balances';
import { Button } from '../../library/Button';
import { GraphWrapper, SectionWrapper } from '../../library/Graphs/Wrappers';

export const ManageBond = () => {

  const { network }: any = useApi();
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
    <SectionWrapper transparent>
      <div className='head'>
        <h4>Bonded Funds</h4>
        <h2>
          {planckToDot(active)} {network.unit} &nbsp;
          <div>
            <Button thin primary inline title='+' />
            <Button thin primary title='-' />
          </div>
        </h2>
      </div>

      <GraphWrapper transparent noMargin>
        <div className='graph' style={{ flex: 0, paddingRight: '1rem' }}>
          <BondedGraph
            active={planckToDot(active)}
            unlocking={planckToDot(totalUnlocking)}
            remaining={planckToDot(remaining)}
            total={total}
          />
        </div>
      </GraphWrapper>

    </SectionWrapper>
  )
}

export default ManageBond;