// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useHelp } from 'contexts/Help';
import { useStaking } from 'contexts/Staking';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { useUnstaking } from 'hooks/useUnstaking';
import { StatBoxList } from 'library/StatBoxList';
import { useOverlay } from 'kits/Overlay/Provider';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Nominations } from 'library/Nominations';
import { useValidators } from 'contexts/Validators/ValidatorEntries';
import { ListStatusHeader } from 'library/List';
import { ManageBond } from './ManageBond';
import { ActiveNominatorsStat } from './Stats/ActiveNominators';
import { MinimumActiveStakeStat } from './Stats/MinimumActiveStake';
import { MinimumNominatorBondStat } from './Stats/MinimumNominatorBond';
import { Status } from './Status';
import { UnstakePrompts } from './UnstakePrompts';
import { useSyncing } from 'hooks/useSyncing';
import { useBalances } from 'contexts/Balances';
import { ButtonHelp, ButtonPrimary } from 'ui-buttons';
import { PageRow, RowSection } from 'ui-structure';
import { WithdrawPrompt } from 'library/WithdrawPrompt';

export const Active = () => {
  const { t } = useTranslation();
  const { openHelp } = useHelp();
  const { syncing } = useSyncing();
  const { inSetup } = useStaking();
  const { getNominations } = useBalances();
  const { openCanvas } = useOverlay().canvas;
  const { isFastUnstaking } = useUnstaking();
  const { formatWithPrefs } = useValidators();
  const { activeAccount } = useActiveAccounts();

  const nominated = formatWithPrefs(getNominations(activeAccount));
  const ROW_HEIGHT = 220;

  return (
    <>
      <StatBoxList>
        <ActiveNominatorsStat />
        <MinimumNominatorBondStat />
        <MinimumActiveStakeStat />
      </StatBoxList>

      <WithdrawPrompt bondFor="nominator" />

      <UnstakePrompts />
      <PageRow>
        <RowSection secondary vLast>
          <CardWrapper height={ROW_HEIGHT}>
            <ManageBond />
          </CardWrapper>
        </RowSection>
        <RowSection hLast>
          <Status height={ROW_HEIGHT} />
        </RowSection>
      </PageRow>
      <PageRow>
        <CardWrapper>
          {nominated?.length || inSetup() || syncing ? (
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
                    text={`${t('nominate.nominate', { ns: 'pages' })}`}
                    disabled={inSetup() || syncing || isFastUnstaking}
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
