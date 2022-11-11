// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ButtonSecondary } from '@rossbulat/polkadot-dashboard-ui';
import { useUi } from 'contexts/UI';
import { defaultPoolSetup } from 'contexts/UI/defaults';
import { SetupType } from 'contexts/UI/types';
import { CardWrapper } from 'library/Graphs/Wrappers';
import { PageTitle } from 'library/PageTitle';
import { Nominate } from 'library/SetupSteps/Nominate';
import { Element } from 'react-scroll';
import { PageRowWrapper, TopBarWrapper } from 'Wrappers';
import { Bond } from './Bond';
import { PoolName } from './PoolName';
import { PoolRoles } from './PoolRoles';
import { Summary } from './Summary';

export const Create = () => {
  const { setOnPoolSetup, setActiveAccountSetup } = useUi();

  return (
    <>
      <PageTitle title="Create a Pool" />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <TopBarWrapper>
          <span>
            <ButtonSecondary
              lg
              text="Back"
              iconLeft={faChevronLeft}
              iconTransform="shrink-3"
              onClick={() => setOnPoolSetup(0)}
            />
          </span>
          <span>
            <ButtonSecondary
              lg
              text="Cancel"
              onClick={() => {
                setOnPoolSetup(0);
                setActiveAccountSetup(SetupType.Pool, defaultPoolSetup);
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
