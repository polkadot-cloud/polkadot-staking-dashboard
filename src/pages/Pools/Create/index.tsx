// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ButtonSecondary } from '@rossbulat/polkadot-dashboard-ui';
import { useConnect } from 'contexts/Connect';
import { useSetup } from 'contexts/Setup';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { Nominate } from 'library/SetupSteps/Nominate';
import { useTranslation } from 'react-i18next';
import { Element } from 'react-scroll';
import { PageRowWrapper, TopBarWrapper } from 'Wrappers';
import { Bond } from './Bond';
import { PoolName } from './PoolName';
import { PoolRoles } from './PoolRoles';
import { Summary } from './Summary';

export const Create = () => {
  const { t } = useTranslation('pages');
  const { activeAccount } = useConnect();
  const { setOnPoolSetup, removeSetupProgress } = useSetup();

  return (
    <>
      <PageTitle title={t('pools.createAPool')} />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <TopBarWrapper>
          <span>
            <ButtonSecondary
              lg
              text={t('pools.back')}
              iconLeft={faChevronLeft}
              iconTransform="shrink-3"
              onClick={() => setOnPoolSetup(false)}
            />
          </span>
          <span>
            <ButtonSecondary
              lg
              text={t('pools.cancel')}
              onClick={() => {
                setOnPoolSetup(false);
                removeSetupProgress('pool', activeAccount);
              }}
            />
          </span>
          <div className="right" />
        </TopBarWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <Element name="metadata" style={{ position: 'absolute' }} />
          <PoolName section={1} />
        </CardWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <Element name="nominate" style={{ position: 'absolute' }} />
          <Nominate
            batchKey="generate_nominations_create_pool"
            bondFor="pool"
            section={2}
          />
        </CardWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <Element name="roles" style={{ position: 'absolute' }} />
          <PoolRoles section={3} />
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
