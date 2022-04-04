// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageProps } from '../types';
import { Wrapper, ProgressButton } from './Wrappers';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, SecondaryWrapper, StickyWrapper } from '../../library/Layout';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { StatBoxList } from '../../library/StatBoxList';
import { Button } from '../../library/Button';
import { useApi } from '../../contexts/Api';
import { useBalances } from '../../contexts/Balances';
import { planckToDot } from '../../Utils';
import { useConnect } from '../../contexts/Connect';
import { PageTitle } from '../../library/PageTitle';
import { StakingAccount } from './Wrappers';
import Account from '../../library/Account';
import { useAssistant } from '../../contexts/Assistant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle, faCircle } from '@fortawesome/free-regular-svg-icons';
import { StakingInterface } from './StakingInterface';
import { Link } from 'react-scroll'

export const Stake = (props: PageProps) => {

  const { goToDefinition } = useAssistant();
  const { network }: any = useApi();
  const { getAccountLedger, getBondedAccount, getAccountNominations }: any = useBalances();
  const { activeAccount } = useConnect();

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
    <>
      <Wrapper>
        <PageTitle title={title} />
        {controller !== null && <StatBoxList title="This Session" items={items} />}
        <PageRowWrapper noVerticalSpacer>

          <MainWrapper paddingRight>
            <StakingInterface />
          </MainWrapper>

          {controller === null &&
            <SecondaryWrapper>
              <StickyWrapper>
                <SectionWrapper>
                  <h3>Progress</h3>

                  <div style={{ width: '100%', marginTop: '1.5rem' }}>
                    <Link to="controller" smooth={true} duration={350} offset={-95}>
                      <ProgressButton>
                        <section>
                          <FontAwesomeIcon color="#ccc" transform='grow-1' icon={faCircle} />
                        </section>
                        <section>Set controller account</section>
                      </ProgressButton>
                    </Link>

                    <Link to="bond" smooth={true} duration={350} offset={-95}>
                      <ProgressButton>
                        <section>
                          <FontAwesomeIcon color="#ccc" transform='grow-1' icon={faCircle} />
                        </section>
                        <section>Set amount to Bond</section>
                      </ProgressButton>
                    </Link>

                    <Link to="nominate" smooth={true} duration={350} offset={-95}>
                      <ProgressButton>
                        <section>
                          <FontAwesomeIcon color="#ccc" transform='grow-1' icon={faCircle} />
                        </section>
                        <section>Select nominations</section>
                      </ProgressButton>
                    </Link>
                    <div style={{ width: '100%', height: '40px', display: 'flex' }}><Button title='Start Staking' primary inline /></div>
                  </div>
                </SectionWrapper>
              </StickyWrapper>
            </SecondaryWrapper>
          }

          {/* Start status */}
          {controller !== null &&
            <SecondaryWrapper>
              <SectionWrapper>
                <h3 style={{ marginBottom: '1rem' }}>
                  Controller
                  <button onClick={() => {
                    goToDefinition('stake', 'Stash and Controller Accounts');
                  }}>
                    <FontAwesomeIcon transform='grow-5' icon={faInfoCircle} />
                  </button>
                </h3>

                <StakingAccount last>
                  <Account
                    canClick={false}
                    unassigned={controller === null}
                    address={controller}
                  /> <Button primary title='Change' />
                </StakingAccount>
              </SectionWrapper>

              <SectionWrapper>
                <h3>Staking Status: Active</h3>
                <h4>You are currently staking and earning rewards.</h4>
              </SectionWrapper>
            </SecondaryWrapper>
          }

        </PageRowWrapper>
      </Wrapper>
    </>
  );
}

export default Stake;