// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import {
  ButtonHelp,
  ButtonPrimary,
  PageRow,
  PageTitle,
  RowSection,
} from '@polkadotcloud/core-ui';
import { useBonded } from 'contexts/Bonded';
import { useConnect } from 'contexts/Connect';
import { useHelp } from 'contexts/Help';
import { useModal } from 'contexts/Modal';
import { useStaking } from 'contexts/Staking';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper, CardWrapper } from 'library/Card/Wrappers';
import { GenerateNominations } from 'library/GenerateNominations';
import { useUnstaking } from 'library/Hooks/useUnstaking';
import { StatBoxList } from 'library/StatBoxList';
import { useTranslation } from 'react-i18next';
import { ControllerNotStash } from './ControllerNotStash';
import { ManageBond } from './ManageBond';
import { Nominations } from './Nominations';
import { ActiveNominatorsStat } from './Stats/ActiveNominators';
import { MinimumActiveStakeStat } from './Stats/MinimumActiveStake';
import { MinimumNominatorBondStat } from './Stats/MinimumNominatorBond';
import { Status } from './Status';
import { UnstakePrompts } from './UnstakePrompts';

export const Active = () => {
  const { t } = useTranslation('pages');
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { isSyncing } = useUi();
  const { targets, setTargets, inSetup } = useStaking();
  const { getAccountNominations } = useBonded();
  const { isFastUnstaking } = useUnstaking();
  const nominations = getAccountNominations(activeAccount);
  const { openHelp } = useHelp();

  const ROW_HEIGHT = 220;

  return (
    <>
      <PageTitle title={`${t('nominate.nominate')}`} />
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
          <CardWrapper $height={ROW_HEIGHT}>
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
                    text={t('nominate.nominate')}
                    iconLeft={faChevronCircleRight}
                    iconTransform="grow-1"
                    disabled={
                      targets.nominations.length === 0 ||
                      inSetup() ||
                      isSyncing ||
                      isFastUnstaking
                    }
                    onClick={() => openModalWith('Nominate', {}, 'small')}
                  />
                </div>
              </CardHeaderWrapper>
              <GenerateNominations
                batchKey="generate_nominations_active"
                setters={[
                  {
                    set: setTargets,
                    current: targets,
                  },
                ]}
                nominations={targets.nominations}
              />
            </>
          )}
        </CardWrapper>
      </PageRow>
    </>
  );
};
