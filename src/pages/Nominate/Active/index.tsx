// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  PageRowWrapper,
  RowPrimaryWrapper,
  RowSecondaryWrapper,
} from 'Wrappers';
import { CardWrapper, CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { StatBoxList } from 'library/StatBoxList';
import { useStaking } from 'contexts/Staking';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { Button } from 'library/Button';
import { PageTitle } from 'library/PageTitle';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import { useModal } from 'contexts/Modal';
import { useUi } from 'contexts/UI';
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons';
import {
  SECTION_FULL_WIDTH_THRESHOLD,
  SIDE_MENU_STICKY_THRESHOLD,
} from 'consts';
import { GenerateNominations } from 'library/SetupSteps/GenerateNominations';
import { Nominations } from './Nominations';
import { ManageBond } from './ManageBond';
import ActiveNominationsStatBox from './Stats/ActiveNominations';
import InacctiveNominationsStatBox from './Stats/InactiveNominations';
import MinimumActiveBondStatBox from './Stats/MinimumActiveBond';
import { ControllerNotImported } from './ControllerNotImported';
import { Status } from './Status';

export const Active = ({ title }: { title: string }) => {
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { isSyncing } = useUi();
  const { targets, setTargets, inSetup } = useStaking();
  const { getAccountNominations } = useBalances();
  const nominations = getAccountNominations(activeAccount);

  const ROW_HEIGHT = 275;

  return (
    <>
      <PageTitle title={title} />
      <StatBoxList>
        <MinimumActiveBondStatBox />
        <ActiveNominationsStatBox />
        <InacctiveNominationsStatBox />
      </StatBoxList>
      <ControllerNotImported />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <RowPrimaryWrapper
          hOrder={1}
          vOrder={0}
          thresholdStickyMenu={SIDE_MENU_STICKY_THRESHOLD}
          thresholdFullWidth={SECTION_FULL_WIDTH_THRESHOLD}
        >
          <Status height={ROW_HEIGHT} />
        </RowPrimaryWrapper>
        <RowSecondaryWrapper
          hOrder={0}
          vOrder={1}
          thresholdStickyMenu={SIDE_MENU_STICKY_THRESHOLD}
          thresholdFullWidth={SECTION_FULL_WIDTH_THRESHOLD}
        >
          <CardWrapper height={ROW_HEIGHT}>
            <ManageBond />
          </CardWrapper>
        </RowSecondaryWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          {nominations.length || inSetup() || isSyncing ? (
            <Nominations bondType="stake" nominator={activeAccount} />
          ) : (
            <>
              <CardHeaderWrapper withAction>
                <h3>
                  Start Nominating
                  <OpenHelpIcon key="Nominations" />
                </h3>
                <div>
                  <Button
                    small
                    inline
                    primary
                    title="Nominate"
                    icon={faChevronCircleRight}
                    transform="grow-1"
                    disabled={targets.length === 0 || inSetup() || isSyncing}
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
      </PageRowWrapper>
    </>
  );
};

export default Active;
