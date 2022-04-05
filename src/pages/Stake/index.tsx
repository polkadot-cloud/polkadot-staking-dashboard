// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { PageProps } from '../types';
import { Wrapper } from './Wrappers';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, SecondaryWrapper, StickyWrapper } from '../../library/Layout';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { StatBoxList } from '../../library/StatBoxList';
import { useApi } from '../../contexts/Api';
import { useBalances } from '../../contexts/Balances';
import { planckToDot } from '../../Utils';
import { useConnect } from '../../contexts/Connect';
import { PageTitle } from '../../library/PageTitle';
import { StakingInterface } from './StakingInterface';
import { useStaking } from '../../contexts/Staking';
import { Progress } from './Progress';
import { Controller } from './Controller';

export const Stake = (props: PageProps) => {

  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { getAccountLedger, getBondedAccount, getAccountNominations }: any = useBalances();
  const { inSetup } = useStaking();

  // monitor page title sticky
  const [stickyTitle, setStickyTitle] = useState(false);

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
        <PageTitle title={title} setStickyTitle={setStickyTitle} />
        {!inSetup() && <StatBoxList title="This Session" items={items} />}
        <PageRowWrapper noVerticalSpacer>

          <MainWrapper paddingRight style={{ maxWidth: inSetup() ? '55%' : '' }}>
            <StakingInterface />
          </MainWrapper>

          {inSetup() &&
            <SecondaryWrapper>
              <Progress stickyTitle={stickyTitle} />
            </SecondaryWrapper>
          }

          {/* Start status */}
          {!inSetup() &&
            <SecondaryWrapper>
              <StickyWrapper>
                <Controller />

                <SectionWrapper>
                  <h3>Staking Status: Active</h3>
                  <h4>You are currently staking and earning rewards.</h4>
                </SectionWrapper>
              </StickyWrapper>
            </SecondaryWrapper>
          }

        </PageRowWrapper>
      </Wrapper>
    </>
  );
}

export default Stake;