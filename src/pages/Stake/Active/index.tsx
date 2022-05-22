// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRedoAlt,
  faWallet,
  faChevronCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  PageRowWrapper,
  Separator,
  RowPrimaryWrapper,
  RowSecondaryWrapper,
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
import { useUi } from '../../../contexts/UI';
import { useApi } from '../../../contexts/Api';

export const Active = ({ title }: any) => {
  const { isReady }: any = useApi();
  const { setOnSetup }: any = useUi();
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { isSyncing } = useUi();
  const { getNominationsStatus, staking, targets, setTargets, inSetup } =
    useStaking();
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

  const nominationStatuses = useMemo(() => {
    getNominationsStatus();
  }, [nominations, inSetup()]);

  useEffect(() => {
    if (!inSetup()) {
      const statuses: any =
        nominationStatuses === undefined ? [] : nominationStatuses;
      const total = Object.values(statuses)?.length ?? 0;

      const _active: any = Object.values(statuses).filter(
        (_v: any) => _v === 'active'
      ).length;

      setNominationsStatus({
        total,
        inactive: total - _active,
        active: _active,
      });
    }
  }, [nominationStatuses]);

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
          <SectionWrapper height={310}>
            <div className="head">
              <h4>
                Status
                <OpenAssistantIcon page="stake" title="Staking Status" />
              </h4>
              <h2>
                {inSetup() || isSyncing
                  ? 'Not Staking'
                  : !nominations.length
                  ? 'Inactive: Not Nominating'
                  : nominationsStatus.active
                  ? 'Actively Nominating with Bonded Funds'
                  : 'Waiting for Active Nominations'}
                {inSetup() && (
                  <span>
                    &nbsp;&nbsp;
                    <Button
                      primary
                      inline
                      title="Start Staking"
                      icon={faChevronCircleRight}
                      transform="grow-1"
                      disabled={!isReady}
                      onClick={() => setOnSetup(true)}
                    />
                  </span>
                )}
              </h2>
              <Separator />
              <h4>
                Reward Destination
                <OpenAssistantIcon page="stake" title="Reward Destination" />
              </h4>
              <h2>
                <FontAwesomeIcon
                  icon={
                    (payee === null
                      ? faCircle
                      : payee === 'Staked'
                      ? faRedoAlt
                      : payee === 'None'
                      ? faCircle
                      : faWallet) as IconProp
                  }
                  transform="shrink-4"
                />
                &nbsp;
                {inSetup()
                  ? 'Not Assigned'
                  : payeeStatus?.name ?? 'Not Assigned'}
                &nbsp;&nbsp;
                <div>
                  <Button
                    small
                    inline
                    primary
                    disabled={inSetup() || isSyncing}
                    title="Update"
                    onClick={() => openModalWith('UpdatePayee', {}, 'small')}
                  />
                </div>
              </h2>
            </div>
          </SectionWrapper>
        </RowPrimaryWrapper>
        <RowSecondaryWrapper hOrder={0} vOrder={1}>
          <SectionWrapper height={310}>
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
                    disabled={targets.length === 0 || inSetup() || isSyncing}
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
