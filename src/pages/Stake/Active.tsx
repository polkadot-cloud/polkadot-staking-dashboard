// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, SecondaryWrapper, StickyWrapper } from '../../library/Layout';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { StatBoxList } from '../../library/StatBoxList';
import { useApi } from '../../contexts/Api';
import { useBalances } from '../../contexts/Balances';
import { planckToDot } from '../../Utils';
import { useConnect } from '../../contexts/Connect';
import { useStaking } from '../../contexts/Staking';
import { Controller } from './Controller';
import { Separator } from './Wrappers';
import { Nominations } from './Nominations';
import { SetController } from './SetController';
import { Bond } from './Bond';
import { Element } from 'react-scroll';

export const Active = () => {

  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { getAccountLedger, getBondedAccount, getAccountNominations }: any = useBalances();
  const { hasController } = useStaking();

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

  // for updating controller
  // TODO: abstract into a modal
  const [setup, setSetup] = useState({
    controller: null,
  });

  return (
    <>
      <StatBoxList title="This Session" items={items} />
      <PageRowWrapper noVerticalSpacer>
        <MainWrapper paddingRight>
          {!hasController() &&
            <SectionWrapper>
              <Separator padding />
              <Element name="controller" style={{ position: 'absolute' }} />
              <SetController
                setup={setup}
                setSetup={setSetup}
              />
            </SectionWrapper>
          }
          <SectionWrapper>
            <Element name="bond" style={{ position: 'absolute' }} />
            <Bond />
          </SectionWrapper>

          <SectionWrapper>
            <Element name="nominate" style={{ position: 'absolute' }} />
            <Nominations />
          </SectionWrapper>
        </MainWrapper>

        <SecondaryWrapper>
          <StickyWrapper>
            <Controller />
            <SectionWrapper>
              <h3>Staking Status: Active</h3>
              <h4>You are currently staking and earning rewards.</h4>
            </SectionWrapper>
          </StickyWrapper>
        </SecondaryWrapper>
      </PageRowWrapper>
    </>
  );
}

export default Active;