// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { PageRowWrapper } from 'Wrappers';
import { CardWrapper, CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { OpenAssistantIcon } from 'library/OpenAssistantIcon';
import { useApi } from 'contexts/Api';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'contexts/Themes';
import { PoolState } from 'contexts/Pools/types';
import { MembersList } from './MembersList';

export const Members = () => {
  const { network } = useApi();
  const { mode } = useTheme();
  const { getMembersOfPool } = usePoolMembers();
  const { activeBondedPool, isOwner, isStateToggler } = useActivePool();

  const poolMembers = getMembersOfPool(activeBondedPool?.id ?? 0);
  const poolMembersTitle = `${poolMembers.length} Member${
    poolMembers.length === 1 ? `` : `s`
  }`;

  const networkColorsSecondary: any = network.colors.secondary;
  const annuncementBorderColor = networkColorsSecondary[mode];

  return (
    <>
      {/* Pool in Blocked state: allow root & stage toggler to unbond & withdraw members */}
      {((activeBondedPool?.state === PoolState.Block && isOwner()) ||
        isStateToggler()) && (
        <PageRowWrapper className="page-padding" noVerticalSpacer>
          <CardWrapper
            style={{ border: `1px solid ${annuncementBorderColor}` }}
          >
            <div className="content">
              <h3>Pool Currently Locked</h3>
              <h4>
                You have permission to unbond and withdraw funds of any pool
                member. Use a member&apos;s menu ({' '}
                <FontAwesomeIcon icon={faBars} transform="shrink-2" /> ) to
                select management options.
              </h4>
            </div>
          </CardWrapper>
        </PageRowWrapper>
      )}

      {/* Pool in Destroying state: allow anyone to unbond & withdraw members */}
      {activeBondedPool?.state === PoolState.Destroy && (
        <PageRowWrapper className="page-padding" noVerticalSpacer>
          <CardWrapper
            style={{ border: `1px solid ${annuncementBorderColor}` }}
          >
            <div className="content">
              <h3>Pool in Destroying State</h3>
              <h4>
                You have permission to unbond and withdraw funds of any pool
                member. Use a member&apos;s menu ({' '}
                <FontAwesomeIcon icon={faBars} transform="shrink-2" /> ) to
                select management options.
              </h4>
            </div>
          </CardWrapper>
        </PageRowWrapper>
      )}

      <PageRowWrapper className="page-padding" noVerticalSpacer>
        <CardWrapper>
          <CardHeaderWrapper>
            <h3>
              {poolMembersTitle}
              <OpenAssistantIcon page="pools" title="Nomination Pools" />
            </h3>
          </CardHeaderWrapper>
          <MembersList
            title="Pool Members"
            batchKey="active_pool_members"
            members={poolMembers}
            pagination
            selectToggleable={false}
            allowMoreCols
          />
        </CardWrapper>
      </PageRowWrapper>
    </>
  );
};
