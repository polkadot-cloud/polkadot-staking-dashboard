// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Element } from 'react-scroll';
import { useUi } from 'contexts/UI';
import { PageRowWrapper, TopBarWrapper } from 'Wrappers';
import { PageTitle } from 'library/PageTitle';
import Button from 'library/Button';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { Nominate } from 'library/SetupSteps/Nominate';
import { SetupType } from 'contexts/UI/types';
import { defaultPoolSetup } from 'contexts/UI/defaults';
import { useTranslation } from 'react-i18next';
import { PoolName } from './PoolName';
import { Bond } from './Bond';
import { PoolRoles } from './PoolRoles';
import { Summary } from './Summary';

export const Create = () => {
  const { setOnPoolSetup, setActiveAccountSetup } = useUi();
  const { t } = useTranslation('common');

  return (
    <>
      <PageTitle title={t('pages.pools.create_a_pool')} />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <TopBarWrapper>
          <Button
            inline
            title={t('pages.pools.go_back')}
            icon={faChevronLeft}
            transform="shrink-3"
            onClick={() => setOnPoolSetup(0)}
          />
          <div className="right">
            <Button
              inline
              title={t('pages.pools.cancel')}
              onClick={() => {
                setOnPoolSetup(0);
                setActiveAccountSetup(SetupType.Pool, defaultPoolSetup);
              }}
            />
          </div>
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
            setupType={SetupType.Pool}
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
