// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import {
  ButtonHelp,
  ButtonPrimary,
  PageRow,
  PageTitle,
  RowSection,
} from '@polkadot-cloud/react';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { StatBoxList } from 'library/StatBoxList';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Nominations } from 'library/Nominations';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { ListStatusHeader } from 'library/List';
import { ControllerNotStash } from './ControllerNotStash';
import { ManageBond } from './ManageBond';
import { ActiveNominatorsStat } from './Stats/ActiveNominators';
import { MinimumActiveStakeStat } from './Stats/MinimumActiveStake';
import { MinimumNominatorBondStat } from './Stats/MinimumNominatorBond';
import { Status } from './Status';
import { UnstakePrompts } from './UnstakePrompts';

export const Active = () => {
  const { t } = useTranslation();
  const { isSyncing } = useUi();
  const { openHelp } = useHelp();
  const { inSetup } = useStaking();
  const { nominated } = useValidators();
  const { isFastUnstaking } = useUnstaking();
  const { openCanvas } = useOverlay().canvas;
  const { activeAccount } = useActiveAccounts();

  const ROW_HEIGHT = 220;

  return (
    <>
      <PageTitle title={t('nominate.nominate', { ns: 'pages' })} />
      <StatBoxList>
        <ActiveNominatorsStat />
        <MinimumNominatorBondStat />
        <MinimumActiveStakeStat />
      </StatBoxList>
      <ControllerNotStash />
      <UnstakePrompts />
      <PageRow>
        <RowSection hLast>
          <Status height={ROW_HEIGHT} />
        </RowSection>
        <RowSection secondary>
          <CardWrapper height={ROW_HEIGHT}>
            <ManageBond />
          </CardWrapper>
        </RowSection>
      </PageRow>
      <PageRow>
        <CardWrapper>
          {nominated?.length || inSetup() || isSyncing ? (
            <Nominations bondFor="nominator" nominator={activeAccount} />
          ) : (
            <>
              <CardHeaderWrapper $withAction $withMargin>
                <h3>
                  {t('nominate.nominate', { ns: 'pages' })}
                  <ButtonHelp
                    marginLeft
                    onClick={() => openHelp('Nominations')}
                  />
                </h3>
                <div>
                  <ButtonPrimary
                    iconLeft={faChevronCircleRight}
                    iconTransform="grow-1"
                    text={t('nominate.nominate', { ns: 'pages' })}
                    disabled={inSetup() || isSyncing || isFastUnstaking}
                    onClick={() =>
                      openCanvas({
                        key: 'ManageNominations',
                        scroll: false,
                        options: {
                          bondFor: 'nominator',
                          nominator: activeAccount,
                          nominated,
                        },
                        size: 'xl',
                      })
                    }
                  />
                </div>
              </CardHeaderWrapper>
              <ListStatusHeader>
                {t('notNominating', { ns: 'library' })}.
              </ListStatusHeader>
            </>
          )}
        </CardWrapper>
      </PageRow>
    </>
  );
};
