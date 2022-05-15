// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, useMemo } from 'react';
import { PageRowWrapper } from '../../../Wrappers';
import { MainWrapper, SecondaryWrapper } from '../../../library/Layout';
import { SectionWrapper } from '../../../library/Graphs/Wrappers';
import { StatBoxList } from '../../../library/StatBoxList';
import { useApi } from '../../../contexts/Api';
import { useStaking } from '../../../contexts/Staking';
import { useBalances } from '../../../contexts/Balances';
import { getTotalUnlocking } from '../../../Utils';
import { useConnect } from '../../../contexts/Connect';
import { Nominations } from './Nominations';
import { ManageBond } from './ManageBond';
import { Button } from '../../../library/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRedoAlt,
  faWallet,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Separator } from '../../../Wrappers';
import { PageTitle } from '../../../library/PageTitle';
import { OpenAssistantIcon } from '../../../library/OpenAssistantIcon';
import { useModal } from '../../../contexts/Modal';
import StatBoxListItem from '../../../library/StatBoxList/Item';
import { useStats } from './stats';

export const Active = (props: any) => {
  const { network }: any = useApi();
  const { units } = network;
  const { openModalWith } = useModal();
  const { activeAccount } = useConnect();
  const { getNominationsStatus, staking } = useStaking();
  const { getAccountLedger, getBondedAccount, getAccountNominations }: any =
    useBalances();
  const stats = useStats();

  const { payee } = staking;
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const nominations = getAccountNominations(activeAccount);

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
    let statuses = nominationStatuses;
    let total = Object.values(statuses).length;
    let _active: any = Object.values(statuses).filter(
      (_v: any) => _v === 'active'
    ).length;

    setNominationsStatus({
      total: total,
      inactive: total - _active,
      active: _active,
    });
  }, [nominationStatuses]);

  let { unlocking } = ledger;
  let totalUnlocking = getTotalUnlocking(unlocking, units);

  return (
    <>
      <PageTitle title={props.title} />
      <StatBoxList>
        {stats.map((stat: any, index: number) => (
          <StatBoxListItem {...stat} key={index} />
        ))}
      </StatBoxList>
      <PageRowWrapper noVerticalSpacer>
        <MainWrapper paddingLeft>
          <SectionWrapper style={{ height: 260 }}>
            <div className="head">
              <h4>
                Status
                <OpenAssistantIcon page="stake" title="Staking Status" />
              </h4>
              <h2>
                {nominationsStatus.active
                  ? 'Active and Earning Rewards'
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
                {payee === 'Staked' && 'Back to Staking'}
                {payee === 'Stash' && 'To Stash'}
                {payee === 'Controller' && 'To Controller'}
                {payee === 'Account' && 'To Account'}
                {payee === 'None' && 'Not Set'}
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
          <SectionWrapper style={{ height: 260 }}>
            <ManageBond />
          </SectionWrapper>
        </SecondaryWrapper>
      </PageRowWrapper>
      <PageRowWrapper noVerticalSpacer>
        <SectionWrapper>
          <Nominations />
        </SectionWrapper>
      </PageRowWrapper>
    </>
  );
};

export default Active;
