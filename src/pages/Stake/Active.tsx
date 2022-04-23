// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, useMemo } from 'react';
import { PageRowWrapper } from '../../Wrappers';
import { MainWrapper, SecondaryWrapper } from '../../library/Layout';
import { SectionWrapper } from '../../library/Graphs/Wrappers';
import { StatBoxList } from '../../library/StatBoxList';
import { useApi } from '../../contexts/Api';
import { useStaking } from '../../contexts/Staking';
import { useNetworkMetrics } from '../../contexts/Network';
import { useBalances } from '../../contexts/Balances';
import { planckToDot } from '../../Utils';
import { useConnect } from '../../contexts/Connect';
import { Nominations } from './Nominations';
import { ManageBond } from './ManageBond';
import { Button } from '../../library/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt, faWallet, faCircle } from '@fortawesome/free-solid-svg-icons';
import { Separator } from './Wrappers';
import { PageTitle } from '../../library/PageTitle';
import { OpenAssistantIcon } from '../../library/OpenAssistantIcon';

export const Active = (props: any) => {

  const { network }: any = useApi();
  const { activeAccount } = useConnect();
  const { metrics } = useNetworkMetrics();
  const { getNominationsStatus, eraStakers, staking } = useStaking();
  const { getAccountLedger, getBondedAccount, getAccountNominations }: any = useBalances();
  const { payee } = staking;

  const { minActiveBond } = eraStakers;
  const controller = getBondedAccount(activeAccount);
  const ledger = getAccountLedger(controller);
  const nominations = getAccountNominations(activeAccount);

  // handle nomination statuses
  const [nominationsStatus, setNominationsStatus]: any = useState({
    total: 0,
    inactive: 0,
    active: 0,
  });

  const nominationStatuses = useMemo(() => getNominationsStatus(), [nominations]);

  useEffect(() => {
    let statuses = nominationStatuses;
    let total = Object.values(statuses).length;
    let _active: any = Object.values(statuses).filter((_v: any) => _v === 'active').length;

    setNominationsStatus({
      total: total,
      inactive: total - _active,
      active: _active,
    });
  }, [nominationStatuses]);

  let { unlocking } = ledger;
  let totalUnlocking = 0;
  for (let i = 0; i < unlocking.length; i++) {
    unlocking[i] = planckToDot(unlocking[i]);
    totalUnlocking += unlocking[i];
  }

  const items = [
    {
      label: "Active Nominations",
      value: nominationsStatus.active,
      value2: nominationsStatus.active ? 0 : 1,
      total: nominationsStatus.total,
      unit: '',
      tooltip: `${nominationsStatus.active ? `Active` : `Inactive`}`,
      format: "chart-pie",
      assistant: {
        page: 'stake',
        key: 'Nominations',
      }
    },
    {
      label: "Minimum Active Bond",
      value: minActiveBond,
      unit: network.unit,
      format: "number",
      assistant: {
        page: 'stake',
        key: 'Bonding',
      }
    },
    {
      label: "Active Era",
      value: metrics.activeEra.index,
      unit: "",
      format: "number",
      assistant: {
        page: 'validators',
        key: 'Era',
      }
    }
  ];

  return (
    <>
      <PageTitle title={props.title} />
      <StatBoxList title="This Session" items={items} />
      <PageRowWrapper noVerticalSpacer>
        <MainWrapper paddingRight style={{ flex: 1 }}>
          <SectionWrapper style={{ height: 260 }} >
            <div className='head'>
              <h4>
                Status
                <OpenAssistantIcon page='stake' title='Staking Status' />
              </h4>
              <h2>{nominationsStatus.active ? 'Active and Earning Rewards' : 'Waiting for Active Nominations'}</h2>
              <Separator />
              <h4>
                Reward Destination
                <OpenAssistantIcon page='stake' title='Reward Destination' />
              </h4>
              <h2>
                <FontAwesomeIcon
                  icon={payee === 'Staked' ? faRedoAlt : payee === 'None' ? faCircle : faWallet}
                  transform='shrink-4'
                />
                &nbsp;
                {payee === 'Staked' && 'Back to Staking'}
                {payee === 'Stash' && 'To Stash'}
                {payee === 'Controller' && 'To Controller'}
                {payee === 'Account' && 'To Account'}
                {payee === 'None' && 'Not Set'}
                &nbsp;&nbsp;
                <div><Button small inline primary title='Update' /></div>
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
}

export default Active;