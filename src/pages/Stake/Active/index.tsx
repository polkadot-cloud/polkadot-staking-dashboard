// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRedoAlt,
  faWallet,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  PageRowWrapper,
  Separator,
  MainWrapper,
  SecondaryWrapper,
} from '../../../Wrappers';
import { SectionWrapper } from '../../../library/Graphs/Wrappers';
import { StatBoxList } from '../../../library/StatBoxList';
import { useStaking } from '../../../contexts/Staking';
import { useBalances } from '../../../contexts/Balances';
import { useConnect } from '../../../contexts/Connect';
import { Nominations } from './Nominations';
import { ManageBond } from './ManageBond';
import { Button } from '../../../library/Button';
import { GenerateNominations } from '../GenerateNominations';
import { PageTitle } from '../../../library/PageTitle';
import { OpenAssistantIcon } from '../../../library/OpenAssistantIcon';
import { useModal } from '../../../contexts/Modal';
import { PAYEE_STATUS } from '../../../constants';
import ActiveNominationsStatBox from './Stats/ActiveNominations';
import MinimumActiveBondStatBox from './Stats/MinimumActiveBond';
import ActiveEraStatBox from './Stats/ActiveEra';
import { ControllerNotImported } from './ControllerNotImported';

export const Active = (props: any) => {
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { getNominationsStatus, staking, targets, setTargets } = useStaking();
  const { getAccountNominations }: any = useBalances();
  const { payee } = staking;
  const nominations = getAccountNominations(activeAccount);
  const payeeStatus: any = PAYEE_STATUS.find((item: any) => item.key === payee);

  // handle nomination statuses
  const [nominationsStatus, setNominationsStatus]: any = useState({
    total: 0,
    inactive: 0,
    active: 0,
  });

  const nominationStatuses = useMemo(
    () => getNominationsStatus(),
    [nominations]
  );

  useEffect(() => {
    const statuses = nominationStatuses;
    const total = Object.values(statuses).length;
    const _active: any = Object.values(statuses).filter(
      (_v: any) => _v === 'active'
    ).length;

    setNominationsStatus({
      total,
      inactive: total - _active,
      active: _active,
    });
  }, [nominationStatuses]);

  return (
    <>
      <PageTitle title={props.title} />
      <StatBoxList>
        <ActiveNominationsStatBox />
        <MinimumActiveBondStatBox />
        <ActiveEraStatBox />
      </StatBoxList>
      <ControllerNotImported />
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <MainWrapper paddingLeft>
          <SectionWrapper style={{ height: 280 }}>
            <div className="head">
              <h4>
                Status
                <OpenAssistantIcon page="stake" title="Staking Status" />
              </h4>
              <h2>
                {!nominations.length
                  ? 'Inactive: Not Nominating'
                  : nominationsStatus.active
                  ? 'Actively Nominating with Bonded Funds'
                  : 'Waiting for Active Nominations'}
              </h2>
              <Separator />
              <h4>
                Reward Destination
                <OpenAssistantIcon page="stake" title="Reward Destination" />
              </h4>
              <h2>
                <FontAwesomeIcon
                  icon={
                    payee === 'Staked'
                      ? faRedoAlt
                      : payee === 'None'
                      ? faCircle
                      : faWallet
                  }
                  transform="shrink-4"
                />
                &nbsp;
                {payeeStatus.name}
                &nbsp;&nbsp;
                <div>
                  <Button
                    small
                    inline
                    primary
                    title="Update"
                    onClick={() => openModalWith('UpdatePayee', {}, 'small')}
                  />
                </div>
              </h2>
            </div>
          </SectionWrapper>
        </MainWrapper>
        <SecondaryWrapper>
          <SectionWrapper style={{ height: 280 }}>
            <ManageBond />
          </SectionWrapper>
        </SecondaryWrapper>
      </PageRowWrapper>
      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <SectionWrapper>
          {nominations.length ? (
            <Nominations />
          ) : (
            <>
              <div className="head with-action">
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
                    disabled={targets.length === 0}
                    onClick={() => openModalWith('Nominate', {}, 'small')}
                  />
                </div>
              </div>
              <GenerateNominations
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
