// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  ButtonSecondary,
  PageHeading,
  PageRow,
  PageTitle,
} from '@polkadot-cloud/react';
import { extractUrlValue, removeVarFromUrlHash } from '@polkadot-cloud/utils';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Element } from 'react-scroll';
import { useSetup } from 'contexts/Setup';
import { CardWrapper } from 'library/Card/Wrappers';
import { Nominate } from 'library/SetupSteps/Nominate';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Bond } from './Bond';
import { Payee } from './Payee';
import { Summary } from './Summary';

export const Setup = () => {
  const { t } = useTranslation('pages');
  const navigate = useNavigate();
  const { activeAccount } = useActiveAccounts();
  const { setOnNominatorSetup, removeSetupProgress } = useSetup();

  return (
    <>
      <PageTitle title={t('nominate.startNominating')} />
      <PageRow>
        <PageHeading>
          <span>
            <ButtonSecondary
              text={t('nominate.back')}
              iconLeft={faChevronLeft}
              iconTransform="shrink-3"
              onClick={() => {
                if (extractUrlValue('f') === 'overview') {
                  navigate('/overview');
                } else {
                  removeVarFromUrlHash('f');
                  setOnNominatorSetup(false);
                }
              }}
            />
          </span>
          <span>
            <ButtonSecondary
              text={t('nominate.cancel')}
              iconLeft={faTimes}
              onClick={() => {
                removeVarFromUrlHash('f');
                setOnNominatorSetup(false);
                removeSetupProgress('nominator', activeAccount);
              }}
            />
          </span>
          <div className="right" />
        </PageHeading>
      </PageRow>
      <PageRow>
        <CardWrapper>
          <Element name="payee" style={{ position: 'absolute' }} />
          <Payee section={1} />
        </CardWrapper>
      </PageRow>
      <PageRow>
        <CardWrapper>
          <Element name="nominate" style={{ position: 'absolute' }} />
          <Nominate bondFor="nominator" section={2} />
        </CardWrapper>
      </PageRow>
      <PageRow>
        <CardWrapper>
          <Element name="bond" style={{ position: 'absolute' }} />
          <Bond section={3} />
        </CardWrapper>
      </PageRow>
      <PageRow>
        <CardWrapper>
          <Element name="summary" style={{ position: 'absolute' }} />
          <Summary section={4} />
        </CardWrapper>
      </PageRow>
    </>
  );
};
