// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, SecondaryWrapper } from '../../library/Layout';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { useBalances } from '../../contexts/Balances';
import { planckToDot } from '../../Utils';
import { useConnect } from '../../contexts/Connect';
import { useStaking } from '../../contexts/Staking';
import { Progress } from './Progress/Progress';
import { ChooseNominators } from './ChooseNominators';
import { SetController } from './SetController';
import { Bond } from './Bond';
import { Element } from 'react-scroll';

export const Setup = (props: any) => {

  const { stickyTitle } = props;

  const { activeAccount } = useConnect();
  const { getAccountLedger, getBondedAccount }: any = useBalances();
  const { inSetup, hasController } = useStaking();

  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);

  let { unlocking } = ledger;
  let totalUnlocking = 0;
  for (let i = 0; i < unlocking.length; i++) {
    unlocking[i] = planckToDot(unlocking[i]);
    totalUnlocking += unlocking[i];
  }

  let _inSetup: boolean = inSetup();

  const [setup, setSetup] = useState({
    controller: null,
    bond: 0,
    nominations: []
  });

  return (
    <>
      <PageRowWrapper noVerticalSpacer>
        <MainWrapper paddingRight thin={_inSetup}>
          {!hasController() &&
            <SectionWrapper>
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
            <ChooseNominators />
          </SectionWrapper>
        </MainWrapper>

        <SecondaryWrapper>
          <Progress setup={setup} stickyTitle={stickyTitle} />
        </SecondaryWrapper>
      </PageRowWrapper>
    </>
  );
}

export default Setup;