// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Element } from 'react-scroll';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { PageRowWrapper, TopBarWrapper } from 'Wrappers';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { Button } from 'library/Button';
import { useUi } from 'contexts/UI';
import { defaultStakeSetup } from 'contexts/UI/defaults';
import { SetupType } from 'contexts/UI/types';
import { Nominate } from 'library/SetupSteps/Nominate';
import { useTranslation } from 'react-i18next';
import { SetController } from './SetController';
import { Bond } from './Bond';
import { Payee } from './Payee';
import { Summary } from './Summary';

export const Setup = () => {
  const { setOnNominatorSetup, setActiveAccountSetup } = useUi();
  const { t } = useTranslation('common');

  return (
    <>
      <PageTitle title={t('pages.nominate.start_nominating')} />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <TopBarWrapper>
          <Button
            inline
            title={t('pages.nominate.go_back')}
            icon={faChevronLeft}
            transform="shrink-3"
            onClick={() => setOnNominatorSetup(0)}
          />
          <div className="right">
            <Button
              inline
              title={t('pages.nominate.cancel')}
              onClick={() => {
                setOnNominatorSetup(0);
                setActiveAccountSetup(SetupType.Stake, defaultStakeSetup);
              }}
            />
          </div>
        </TopBarWrapper>
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
          <Nominate
            batchKey="generate_nominations_inactive"
            setupType={SetupType.Stake}
            section={3}
          />
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
