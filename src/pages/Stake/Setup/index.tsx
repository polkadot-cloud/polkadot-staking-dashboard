// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Element } from 'react-scroll';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { PageRowWrapper } from '../../../Wrappers';
import { GoBackWrapper } from '../Wrappers';
import { SectionWrapper } from '../../../library/Graphs/Wrappers';
import { PageTitle } from '../../../library/PageTitle';
import { ChooseNominators } from './ChooseNominators';
import { SetController } from './SetController';
import { Bond } from './Bond';
import { Payee } from './Payee';
import { Summary } from './Summary';
import { Button } from '../../../library/Button';
import { useUi } from '../../../contexts/UI';

export const Setup = ({ title }: any) => {
  const { setOnSetup }: any = useUi();

  return (
    <>
      <PageTitle title={`${title} Setup`} />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <GoBackWrapper>
          <Button
            inline
            title="Go Back"
            icon={faChevronLeft}
            transform="shrink-3"
            onClick={() => setOnSetup(0)}
          />
        </GoBackWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <SectionWrapper>
          <Element name="controller" style={{ position: 'absolute' }} />
          <SetController section={1} />
        </SectionWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <SectionWrapper>
          <Element name="payee" style={{ position: 'absolute' }} />
          <Payee section={2} />
        </SectionWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <SectionWrapper>
          <Element name="nominate" style={{ position: 'absolute' }} />
          <ChooseNominators section={3} />
        </SectionWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <SectionWrapper>
          <Element name="bond" style={{ position: 'absolute' }} />
          <Bond section={4} />
        </SectionWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <SectionWrapper>
          <Element name="summary" style={{ position: 'absolute' }} />
          <Summary section={5} />
        </SectionWrapper>
      </PageRowWrapper>
    </>
  );
};

export default Setup;
