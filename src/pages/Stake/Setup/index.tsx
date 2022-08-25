// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Element } from 'react-scroll';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { PageRowWrapper, GoBackWrapper } from 'Wrappers';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { Button } from 'library/Button';
import { useUi } from 'contexts/UI';
import { ChooseNominations } from './ChooseNominations';
import { SetController } from './SetController';
import { Bond } from './Bond';
import { Payee } from './Payee';
import { Summary } from './Summary';

export const Setup = ({ title }: { title: string }) => {
  const { setOnNominatorSetup } = useUi();

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
            onClick={() => setOnNominatorSetup(0)}
          />
        </GoBackWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <Element name="controller" style={{ position: 'absolute' }} />
          <SetController section={1} />
        </CardWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <Element name="payee" style={{ position: 'absolute' }} />
          <Payee section={2} />
        </CardWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <Element name="nominate" style={{ position: 'absolute' }} />
          <ChooseNominations section={3} />
        </CardWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <Element name="bond" style={{ position: 'absolute' }} />
          <Bond section={4} />
        </CardWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <Element name="summary" style={{ position: 'absolute' }} />
          <Summary section={5} />
        </CardWrapper>
      </PageRowWrapper>
    </>
  );
};

export default Setup;
