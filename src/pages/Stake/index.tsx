// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { Wrapper, NominateWrapper, StakingAccount } from './Wrappers';
import { PageRowWrapper } from '../../Wrappers';
import { GraphWrapper, MainWrapper, SecondaryWrapper } from '../Overview/Wrappers';
import BondedGraph from './BondedGraph';
import { motion } from 'framer-motion';
import { Nominations } from './Nominations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight as faGo } from '@fortawesome/free-solid-svg-icons';
import { StatBoxList } from '../../library/StatBoxList';
import { Button, ButtonRow } from '../../library/Button';
import { useApi } from '../../contexts/Api';
import { useBalances } from '../../contexts/Balances';
import { planckToDot } from '../../Utils';
import Account from '../../library/Account';
import { useConnect } from '../../contexts/Connect';

export const Stake = (props: PageProps) => {

  const { network }: any = useApi();
  const { getAccountLedger, getBondedAccount, getAccountNominators }: any = useBalances();
  const { activeAccount } = useConnect();

  const { page } = props;
  const { title } = page;
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const nominators = getAccountNominators(activeAccount);

  const { active, total } = ledger;

  let { unlocking } = ledger;
  let totalUnlocking = 0;
  for (let i = 0; i < unlocking.length; i++) {
    unlocking[i] = planckToDot(unlocking[i]);
    totalUnlocking += unlocking[i];
  }

  const remaining = total - active - totalUnlocking;

  const items = [
    {
      label: "Bonded",
      value: planckToDot(active),
      unit: network.unit,
      format: "number",
    },
    {
      label: "Free",
      value: planckToDot(remaining),
      unit: network.unit,
      format: "number",
    },
    {
      label: "Status",
      value: nominators.length,
      unit: `Nomination${nominators.length === 1 ? `` : `s`}`,
      format: 'number',
    },
  ];

  return (
    <Wrapper>
      <h1>{title}</h1>
      <StatBoxList title="This Session" items={items} />

      <PageRowWrapper noVerticalSpacer>
        <MainWrapper paddingRight>
          <GraphWrapper>
            <h3>Next Steps</h3>

          </GraphWrapper>
          <GraphWrapper>
            <h3>Bonded Funds</h3>
            <div className='graph_with_extra'>
              <div className='graph' style={{ flex: 0, paddingRight: '1rem' }}>
                <BondedGraph
                  active={planckToDot(active)}
                  unlocking={planckToDot(totalUnlocking)}
                  remaining={planckToDot(remaining)}
                  total={total}
                />
              </div>
              <ButtonRow style={{ height: '190px' }}>
                <Button title='Bond Extra' />
                <Button title='Unbond' />
              </ButtonRow>
            </div>
            <Nominations nominators={nominators} />
          </GraphWrapper>
        </MainWrapper>
        <SecondaryWrapper>
          <GraphWrapper>
            <h3>Accounts</h3>
            <StakingAccount>
              <h4>Stash</h4>
              <Account
                canClick={false}
                unassigned={activeAccount === ''}
                address={activeAccount}
              />
            </StakingAccount>
            <StakingAccount last>
              <h4>Controller</h4>
              <Account
                canClick={false}
                unassigned={controller === null}
                address={controller}
              />
            </StakingAccount>
          </GraphWrapper>

          <GraphWrapper>
            <h3>Choose Validators</h3>
            <NominateWrapper>
              <motion.button whileHover={{ scale: 1.01 }}>
                <h2>Manual Selection</h2>
                <p>Manually browse and nominate validators from the validator list.</p>
                <div className='foot'>
                  <p className='go'>
                    Browse Validators
                    <FontAwesomeIcon
                      icon={faGo}
                      transform="shrink-2"
                      style={{ marginLeft: '0.5rem' }}
                    />
                  </p>
                </div>
              </motion.button>
              <motion.button whileHover={{ scale: 1.01 }}>
                <h2>Smart Nominate</h2>
                <p>Nominate the most suited validators based on your requirements.</p>
                <div className='foot'>
                  <p className='go'>
                    Start <FontAwesomeIcon
                      icon={faGo}
                      transform="shrink-2"
                      style={{ marginLeft: '0.5rem' }}
                    />
                  </p>
                </div>
              </motion.button>
            </NominateWrapper>
          </GraphWrapper>

        </SecondaryWrapper>
      </PageRowWrapper>
    </Wrapper>
  );
}

export default Stake;