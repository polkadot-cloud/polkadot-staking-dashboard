// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import {
  ButtonSecondary,
  PageHeading,
  PageRow,
  PageTitle,
} from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { Element } from 'react-scroll';
import { useSetup } from 'contexts/Setup';
import { CardWrapper } from 'library/Card/Wrappers';
import { Nominate } from 'library/SetupSteps/Nominate';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Bond } from './Bond';
import { PoolName } from './PoolName';
import { PoolRoles } from './PoolRoles';
import { Summary } from './Summary';

export const Create = () => {
  const { t } = useTranslation('pages');
  const { activeAccount } = useActiveAccounts();
  const { setOnPoolSetup, removeSetupProgress } = useSetup();

  return (
    <>
      <PageTitle title={t('pools.createAPool')} />
      <PageRow>
        <PageHeading>
          <span>
            <ButtonSecondary
              text={t('pools.back')}
              iconLeft={faChevronLeft}
              iconTransform="shrink-3"
              onClick={() => setOnPoolSetup(false)}
            />
          </span>
          <span>
            <ButtonSecondary
              text={t('pools.cancel')}
              onClick={() => {
                setOnPoolSetup(false);
                removeSetupProgress('pool', activeAccount);
              }}
            />
          </span>
          <div className="right" />
        </PageHeading>
      </PageRow>
      <PageRow>
        <CardWrapper>
          <Element name="metadata" style={{ position: 'absolute' }} />
          <PoolName section={1} />
        </CardWrapper>
      </PageRow>
      <PageRow>
        <CardWrapper>
          <Element name="nominate" style={{ position: 'absolute' }} />
          <Nominate bondFor="pool" section={2} />
        </CardWrapper>
      </PageRow>
      <PageRow>
        <CardWrapper>
          <Element name="roles" style={{ position: 'absolute' }} />
          <PoolRoles section={3} />
        </CardWrapper>
      </PageRow>
      <PageRow>
        <CardWrapper>
          <Element name="bond" style={{ position: 'absolute' }} />
          <Bond section={4} />
        </CardWrapper>
      </PageRow>

      <PageRow>
        <CardWrapper>
          <Element name="summary" style={{ position: 'absolute' }} />
          <Summary section={5} />
        </CardWrapper>
      </PageRow>
    </>
  );
};
