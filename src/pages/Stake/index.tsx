// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { PageProps } from '../types';
import { Wrapper, NominateWrapper, StakingAccount } from './Wrappers';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, SecondaryWrapper } from '../../library/Layout/Wrappers';
import { GraphWrapper } from '../../library/Graphs/Wrappers';
import BondedGraph from './BondedGraph';
import { motion } from 'framer-motion';
import { Nominations } from './Nominations';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight as faGo } from '@fortawesome/free-solid-svg-icons';
import { StatBoxList } from '../../library/StatBoxList';
import { Button, ButtonRow } from '../../library/Button';
import { useApi } from '../../contexts/Api';
import { useBalances } from '../../contexts/Balances';
import { useMessages } from '../../contexts/Messages';
import { planckToDot } from '../../Utils';
import Account from '../../library/Account';
import { useConnect } from '../../contexts/Connect';
import { GLOBAL_MESSGE_KEYS } from '../../constants';

export const Stake = (props: PageProps) => {

  const { network }: any = useApi();
  const { getAccountLedger, getBondedAccount, getAccountNominations }: any = useBalances();
  const { activeAccount } = useConnect();
  const { getMessage }: any = useMessages();

  const [controllerNotImported, setControllerNotImported] = useState(getMessage(GLOBAL_MESSGE_KEYS.CONTROLLER_NOT_IMPORTED));

  useEffect(() => {
    setControllerNotImported(getMessage(GLOBAL_MESSGE_KEYS.CONTROLLER_NOT_IMPORTED));
  }, [getMessage(GLOBAL_MESSGE_KEYS.CONTROLLER_NOT_IMPORTED)]);

  const { page } = props;
  const { title } = page;
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const nominations = getAccountNominations(activeAccount);

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
      value: nominations.length,
      unit: `Nomination${nominations.length === 1 ? `` : `s`}`,
      format: 'number',
    },
  ];

  return (
    <Wrapper>
      <h1 className='title'>{title}</h1>
      <StatBoxList title="This Session" items={items} />

      <PageRowWrapper noVerticalSpacer>
        <MainWrapper paddingRight>

          {/* warning: controller account not present. unable to stake */}
          {controllerNotImported !== null &&
            <GraphWrapper style={{ border: '2px solid rgba(242, 185, 27,0.25)' }}>
              <h3>Next Step: Import Controller Account</h3>
              <h4>You have not imported your Controller account. If you have lost access to your Controller account, set a new Controller now.</h4>

              <ButtonRow style={{ width: '100%', padding: 0, }}>
                <Button title='Set New Controller' />
              </ButtonRow>
            </GraphWrapper>
          }

          {/* finish staking. Start bonding */}
          {controller === null &&
            <GraphWrapper>
              <h3>Set Up Staking</h3>
              <h4>You have not yet started staking. Let's get set up.</h4>

              <ButtonRow style={{ padding: 0, }}>
                <Button title='Start Staking' primary inline />
              </ButtonRow>
            </GraphWrapper>
          }
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
              {/* once staking, have control over bonding */}
              {controller !== null &&
                <ButtonRow style={{ height: '190px' }}>
                  <Button title='Bond Extra' />
                  <Button title='Unbond' />
                </ButtonRow>
              }
            </div>
            <Nominations nominations={nominations} />
          </GraphWrapper>
        </MainWrapper>
        <SecondaryWrapper>
          <GraphWrapper>
            <h3>Accounts</h3>
            <h4>Stash</h4>
            <StakingAccount>
              <Account
                canClick={false}
                unassigned={activeAccount === ''}
                address={activeAccount}
              />
            </StakingAccount>
            <h4>Controller</h4>
            <StakingAccount last>
              <Account
                canClick={false}
                unassigned={controller === null}
                address={controller}
              /> <Button title='Set Controller' />
            </StakingAccount>
          </GraphWrapper>

          <GraphWrapper>
            <h3>Choose Validators</h3>
            <NominateWrapper style={{ marginTop: '0.5rem' }}>
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