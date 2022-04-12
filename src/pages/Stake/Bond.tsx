// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { planckToDot } from '../../Utils';
import BondedGraph from './BondedGraph';
import { useApi } from '../../contexts/Api';
import { useConnect } from '../../contexts/Connect';
import { useBalances } from '../../contexts/Balances';
import { useStaking } from '../../contexts/Staking';
import { Button, ButtonRow } from '../../library/Button';
import { GraphWrapper, SectionWrapper } from '../../library/Graphs/Wrappers';
import { HalfWrapper, HalfItem } from '../../library/Layout';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';

export const Bond = () => {

  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { isBonding } = useStaking();
  const { getAccountLedger, getBondedAccount, getAccountBalance }: any = useBalances();
  const balance = getAccountBalance(activeAccount);
  let { free } = balance;

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
        <h2>
          Bond{total > 0 && `ed`} {network.unit}
          <OpenAssistantIcon page="stake" title="Bonding" />
        </h2>
      </div>

      {isBonding() &&
        <HalfWrapper alignItems='flex-end'>
          <HalfItem>
            <GraphWrapper style={{ background: 'none', marginBottom: '1.5rem' }}>
              <div className='graph_with_extra'>
                <div className='graph' style={{ flex: 0, paddingRight: '1rem' }}>
                  <BondedGraph
                    active={planckToDot(active)}
                    unlocking={planckToDot(totalUnlocking)}
                    remaining={planckToDot(remaining)}
                    total={total}
                  />
                </div>
              </div>
            </GraphWrapper>
          </HalfItem>
          <HalfItem>
            <ButtonRow style={{ height: '190px' }}>
              <Button primary title='Bond Extra' />
              <Button primary title='Unbond' />
            </ButtonRow>
          </HalfItem>
        </HalfWrapper>
      }

      {!isBonding() &&
        <HalfWrapper alignItems='flex-end'>
          <HalfItem>
            <h5>Available: {planckToDot(free)} {network.unit}</h5>
            <input type="text" placeholder='0 DOT' />
          </HalfItem>
          <HalfItem>
            <div>
              <Button inline title={`Max`} />
            </div>
          </HalfItem>
        </HalfWrapper>
      }
    </SectionWrapper>
  )
}

export default Bond;