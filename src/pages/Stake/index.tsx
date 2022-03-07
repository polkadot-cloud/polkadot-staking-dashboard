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
  const { getAccountLedger, getBondedAccount }: any = useBalances();
  const { activeAccount } = useConnect();

  const { page } = props;
  const { title } = page;
  const ledger = getAccountLedger(activeAccount);
  const controller = getBondedAccount(activeAccount);

  const { active } = ledger;

  let { unlocking } = ledger;
  let totalUnlocking = 0;
  for (let i = 0; i < unlocking.length; i++) {
    unlocking[i] = planckToDot(unlocking[i]);
    totalUnlocking += unlocking[i];
  }

  const items = [
    {
      label: "Bonded",
      value: planckToDot(active),
      unit: network.unit,
      format: "number",
    },
    {
      label: "Free",
      value: 12,
      unit: network.unit,
      format: "number",
    },
    {
      label: "Status",
      value: "6 Nominations",
      unit: "",
      format: 'text',
    },
  ];

  return (
    <Wrapper>
      <h1>{title}</h1>
      <StatBoxList title="This Session" items={items} />

      <PageRowWrapper noVerticalSpacer>
        <SecondaryWrapper>
          <GraphWrapper>
            <h3>Staking Accounts</h3>
            <StakingAccount>
              <h4>Stash</h4>
              <Account
                address={activeAccount}
              />
            </StakingAccount>
            <StakingAccount>
              <h4>Controller</h4>
              <Account
                clickable={false}
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
        <MainWrapper paddingLeft>
          <GraphWrapper>
            <h3>Bonded Funds</h3>
            <div className='graph_with_extra'>
              <div className='graph' style={{ flex: 0, paddingRight: '1rem' }}>
                <BondedGraph
                  active={planckToDot(active)}
                  unlocking={planckToDot(totalUnlocking)}
                />
              </div>
              <ButtonRow style={{ height: '190px' }}>
                <Button title='Bond Extra' />
                <Button title='Unbond' />
              </ButtonRow>
            </div>

            <Nominations />
          </GraphWrapper>
        </MainWrapper>
      </PageRowWrapper>
    </Wrapper>
  );
}

export default Stake;