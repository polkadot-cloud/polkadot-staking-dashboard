// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  PageRowWrapper,
  RowPrimaryWrapper,
  RowSecondaryWrapper,
} from 'Wrappers';
import { SectionWrapper, SectionHeaderWrapper } from 'library/Graphs/Wrappers';
import { StatBoxList } from 'library/StatBoxList';
import { useStaking } from 'contexts/Staking';
import { useBalances } from 'contexts/Balances';
import { useConnect } from 'contexts/Connect';
import { Button } from 'library/Button';
import { PageTitle } from 'library/PageTitle';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { useModal } from 'contexts/Modal';
import { useUi } from 'contexts/UI';
import { ConnectContextInterface } from 'types/connect';
import { Nominations } from './Nominations';
import { ManageBond } from './ManageBond';
import { GenerateNominations } from '../GenerateNominations';
import ActiveNominationsStatBox from './Stats/ActiveNominations';
import MinimumActiveBondStatBox from './Stats/MinimumActiveBond';
import ActiveEraStatBox from './Stats/ActiveEra';
import { ControllerNotImported } from './ControllerNotImported';
import { Status } from './Status';

export const Active = ({ title }: any) => {
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { isSyncing } = useUi();
  const { targets, setTargets, inSetup } = useStaking();
  const { getAccountNominations }: any = useBalances();
  const nominations = getAccountNominations(activeAccount);

  return (
    <>
      <PageTitle title={title} />
      <StatBoxList>
        <ActiveNominationsStatBox />
        <MinimumActiveBondStatBox />
        <ActiveEraStatBox />
      </StatBoxList>
      <ControllerNotImported />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <RowPrimaryWrapper hOrder={1} vOrder={0}>
          <Status />
        </RowPrimaryWrapper>
        <RowSecondaryWrapper hOrder={0} vOrder={1}>
          <SectionWrapper height={300}>
            <ManageBond />
          </SectionWrapper>
        </RowSecondaryWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <SectionWrapper>
          {nominations.length || inSetup() || isSyncing ? (
            <Nominations />
          ) : (
            <>
              <SectionHeaderWrapper withAction>
                <h2>
                  Generate Nominations
                  <OpenAssistantIcon page="stake" title="Nominations" />
                </h2>
                <div>
                  <Button
                    small
                    inline
                    primary
                    title="Nominate"
                    disabled={targets.length === 0 || inSetup() || isSyncing}
                    onClick={() => openModalWith('Nominate', {}, 'small')}
                  />
                </div>
              </SectionHeaderWrapper>
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
        </SectionWrapper>
      </PageRowWrapper>
    </>
  );
};

export default Active;
