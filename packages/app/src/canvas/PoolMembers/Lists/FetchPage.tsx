// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { useNetwork } from 'contexts/Network';
import { usePlugins } from 'contexts/Plugins';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import type { PoolMember } from 'contexts/Pools/PoolMembers/types';
import { SubscanController } from 'controllers/Subscan';
import { List, ListStatusHeader, Wrapper as ListWrapper } from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';
import { Pagination } from 'library/List/Pagination';
import { ListProvider } from 'library/List/context';
import { poolMembersPerPage } from 'library/List/defaults';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Member } from './Member';
import type { FetchpageMembersListProps } from './types';

export const MembersListInner = ({
  pagination,
  batchKey,
  memberCount,
}: FetchpageMembersListProps) => {
  const { t } = useTranslation('pages');
  const { network } = useNetwork();
  const { pluginEnabled } = usePlugins();
  const { activeAccount } = useActiveAccounts();
  const { activePool } = useActivePool();
  const {
    poolMembersApi,
    setPoolMembersApi,
    fetchedPoolMembersApi,
    setFetchedPoolMembersApi,
    fetchPoolMembersMetaBatch,
  } = usePoolMembers();

  // current page.
  const [page, setPage] = useState<number>(1);

  // pagination
  const totalPages = Math.ceil(Number(memberCount) / poolMembersPerPage);
  const pageEnd = poolMembersPerPage - 1;
  const pageStart = pageEnd - (poolMembersPerPage - 1);

  // handle validator list bootstrapping
  const fetchingMemberList = useRef<boolean>(false);

  const setupMembersList = async () => {
    const poolId = activePool?.id || 0;

    if (poolId > 0 && !fetchingMemberList.current) {
      fetchingMemberList.current = true;

      const newMembers = (await SubscanController.handleFetchPoolMembers(
        poolId,
        page
      )) as PoolMember[];

      fetchingMemberList.current = false;
      setPoolMembersApi([...newMembers]);
      fetchPoolMembersMetaBatch(batchKey, newMembers, true);
      setFetchedPoolMembersApi('synced');
    }
  };

  // get throttled subset or entire list
  const listMembers = poolMembersApi
    .slice(pageStart)
    .slice(0, poolMembersPerPage);

  // Refetch list when page changes.
  useEffect(() => {
    if (pluginEnabled('subscan')) {
      setFetchedPoolMembersApi('unsynced');
      setPoolMembersApi([]);
    }
  }, [page, activeAccount, pluginEnabled('subscan')]);

  // Refetch list when network changes.
  useEffect(() => {
    setFetchedPoolMembersApi('unsynced');
    setPoolMembersApi([]);
    setPage(1);
  }, [network]);

  // Configure list when network is ready to fetch.
  useEffect(() => {
    if (fetchedPoolMembersApi === 'unsynced') {
      setupMembersList();
    }
  }, [fetchedPoolMembersApi, activePool]);

  return (
    <ListWrapper>
      <List $flexBasisLarge={'33.33%'}>
        {pagination && (
          <Pagination
            page={page}
            total={totalPages}
            setter={setPage}
            disabled={fetchedPoolMembersApi !== 'synced'}
          />
        )}
        {fetchedPoolMembersApi !== 'synced' ? (
          <ListStatusHeader style={{ marginTop: '0.5rem' }}>
            {t('pools.fetchingMemberList')}....
          </ListStatusHeader>
        ) : (
          <MotionContainer>
            {listMembers.map((member: PoolMember, index: number) => (
              <Member
                key={`nomination_${index}`}
                who={member.who}
                batchKey={batchKey}
                batchIndex={poolMembersApi.indexOf(member)}
              />
            ))}
          </MotionContainer>
        )}
      </List>
    </ListWrapper>
  );
};

export const MembersList = (props: FetchpageMembersListProps) => {
  const { selectToggleable } = props;

  return (
    <ListProvider selectToggleable={selectToggleable}>
      <MembersListInner {...props} />
    </ListProvider>
  );
};
