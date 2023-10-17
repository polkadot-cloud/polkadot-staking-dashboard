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
import { useBonded } from 'contexts/Bonded';
import { useHelp } from 'contexts/Help';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { StatBoxList } from 'library/StatBoxList';
import { useOverlay } from '@polkadot-cloud/react/hooks';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Nominations } from 'library/Nominations';
import { ControllerNotStash } from './ControllerNotStash';
import { ManageBond } from './ManageBond';
import { ActiveNominatorsStat } from './Stats/ActiveNominators';
import { MinimumActiveStakeStat } from './Stats/MinimumActiveStake';
import { MinimumNominatorBondStat } from './Stats/MinimumNominatorBond';
import { Status } from './Status';
import { UnstakePrompts } from './UnstakePrompts';

export const Active = () => {
  const { t } = useTranslation('pages');
  const { isSyncing } = useUi();
  const { openHelp } = useHelp();
  const { targets, inSetup } = useStaking();
  const { openCanvas } = useOverlay().canvas;
  const { isFastUnstaking } = useUnstaking();
  const { getAccountNominations } = useBonded();
  const { activeAccount } = useActiveAccounts();
  const nominations = getAccountNominations(activeAccount);

  const ROW_HEIGHT = 220;

  return (
    <>
      <PageTitle title={t('nominate.nominate')} />
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
          {nominations.length || inSetup() || isSyncing ? (
            <Nominations bondFor="nominator" nominator={activeAccount} />
          ) : (
            <>
              <CardHeaderWrapper $withAction>
                <h3>
                  {t('nominate.nominate')}
                  <ButtonHelp
                    marginLeft
                    onClick={() => openHelp('Nominations')}
                  />
                </h3>
                <div>
                  <ButtonPrimary
                    iconLeft={faChevronCircleRight}
                    iconTransform="grow-1"
                    text={t('nominate.nominate')}
                    disabled={inSetup() || isSyncing || isFastUnstaking}
                    onClick={() =>
                      openCanvas({
                        key: 'ManageNominations',
                        scroll: false,
                        options: {
                          bondFor: 'pool',
                          nominator: activeAccount,
                          nominated: targets?.nominations || [],
                        },
                        size: 'xl',
                      })
                    }
                  />
                </div>
              </CardHeaderWrapper>
              <h4>You are not nominating any validators.</h4>
            </>
          )}
        </CardWrapper>
      </PageRow>
    </>
  );
};
