// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageRowWrapper } from '../../../Wrappers';
import { SectionWrapper } from '../../../library/Graphs/Wrappers';
import { useBalances } from '../../../contexts/Balances';
import { planckToDot } from '../../../Utils';
import { useConnect } from '../../../contexts/Connect';
import { useStaking } from '../../../contexts/Staking';
import { Element } from 'react-scroll';
import { PageTitle } from '../../../library/PageTitle';
import { ChooseNominators } from './ChooseNominators';
import { SetController } from './SetController';
import { Bond } from './Bond';
import { Payee } from './Payee';
import { Summary } from './Summary';

export const Setup = (props: any) => {

  const { activeAccount } = useConnect();
  const { getAccountLedger, getBondedAccount }: any = useBalances();
  const { hasController } = useStaking();

  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);

  let { unlocking } = ledger;
  let totalUnlocking = 0;
  for (let i = 0; i < unlocking.length; i++) {
    unlocking[i] = planckToDot(unlocking[i]);
    totalUnlocking += unlocking[i];
  }

  return (
    <>
      <PageTitle title={`${props.title} Setup`} />
      <PageRowWrapper noVerticalSpacer>
        {!hasController() &&
          <SectionWrapper>
            <Element name="controller" style={{ position: 'absolute' }} />
            <SetController section={1} />
          </SectionWrapper>
        }
      </PageRowWrapper>
      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper>
          <Element name="payee" style={{ position: 'absolute' }} />
          <Payee section={2} />
        </SectionWrapper>
      </PageRowWrapper>
      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper>
          <Element name="nominate" style={{ position: 'absolute' }} />
          <ChooseNominators section={3} />
        </SectionWrapper>
      </PageRowWrapper>
      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper>
          <Element name="bond" style={{ position: 'absolute' }} />
          <Bond section={4} />
        </SectionWrapper>
      </PageRowWrapper>
      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper>
          <Element name="summary" style={{ position: 'absolute' }} />
          <Summary section={5} />
        </SectionWrapper>
      </PageRowWrapper>
    </>
  );
}

export default Setup;