// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Element } from 'react-scroll';
import { PageRowWrapper } from '../../../Wrappers';
import { SectionWrapper } from '../../../library/Graphs/Wrappers';
import { useStaking } from '../../../contexts/Staking';
import { PageTitle } from '../../../library/PageTitle';
import { ChooseNominators } from './ChooseNominators';
import { SetController } from './SetController';
import { Bond } from './Bond';
import { Payee } from './Payee';
import { Summary } from './Summary';

export const Setup = (props: any) => {
  const { hasController } = useStaking();

  return (
    <>
      <PageTitle title={`${props.title} Setup`} />
      <PageRowWrapper noVerticalSpacer>
        {!hasController() && (
          <SectionWrapper>
            <Element name="controller" style={{ position: 'absolute' }} />
            <SetController section={1} />
          </SectionWrapper>
        )}
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
};

export default Setup;
