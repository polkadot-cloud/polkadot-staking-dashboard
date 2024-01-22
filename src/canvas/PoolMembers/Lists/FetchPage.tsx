// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListItemsPerBatch, ListItemsPerPage } from 'consts';
import { usePlugins } from 'contexts/Plugins';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { List, ListStatusHeader, Wrapper as ListWrapper } from 'library/List';
import { Pagination } from 'library/List/Pagination';
import { ListProvider } from 'library/List/context';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Member } from './Member';
import type { FetchpageMembersListProps } from './types';
import type { PoolMember } from 'contexts/Pools/PoolMembers/types';
import { MotionContainer } from 'library/List/MotionContainer';
import { SubscanController } from 'static/SubscanController';

export const MembersListInner = ({
  pagination,
  batchKey,
  disableThrottle = false,
  memberCount,
}: FetchpageMembersListProps) => {
  const { t } = useTranslation('pages');
  const { network } = useNetwork();
  const { pluginEnabled } = usePlugins();
  const { activeAccount } = useActiveAccounts();
  const { selectedActivePool } = useActivePools();
  const {
    poolMembersApi,
    setPoolMembersApi,
    fetchedPoolMembersApi,
    setFetchedPoolMembersApi,
    fetchPoolMembersMetaBatch,
  } = usePoolMembers();

  // current page.
  const [page, setPage] = useState<number>(1);

  // current render iteration.
  const [renderIteration, setRenderIterationState] = useState<number>(1);

  // render throttle iteration.
  const renderIterationRef = useRef(renderIteration);
  const setRenderIteration = (iter: number) => {
    renderIterationRef.current = iter;
    setRenderIterationState(iter);
  };

  // pagination
  const totalPages = Math.ceil(memberCount / ListItemsPerPage);
  const pageEnd = ListItemsPerPage - 1;
  const pageStart = pageEnd - (ListItemsPerPage - 1);

  // render batch
  const batchEnd = Math.min(
    renderIteration * ListItemsPerBatch - 1,
    ListItemsPerPage
  );

  // handle validator list bootstrapping
  const fetchingMemberList = useRef<boolean>(false);

  const setupMembersList = async () => {
    const poolId = selectedActivePool?.id || 0;

    if (poolId > 0 && !fetchingMemberList.current) {
      fetchingMemberList.current = true;

      const newMembers: PoolMember[] =
        await SubscanController.handleFetchPoolMembers(poolId, page);

      fetchingMemberList.current = false;
      setPoolMembersApi([...newMembers]);
      fetchPoolMembersMetaBatch(batchKey, newMembers, true);
      setFetchedPoolMembersApi('synced');
    }
  };

  // get throttled subset or entire list
  const listMembers = poolMembersApi
    .slice(pageStart)
    .slice(0, ListItemsPerPage);

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
  }, [fetchedPoolMembersApi, selectedActivePool]);

  // Render throttle.
  useEffect(() => {
    if (!(batchEnd >= pageEnd || disableThrottle)) {
      setTimeout(() => {
        setRenderIteration(renderIterationRef.current + 1);
      }, 500);
    }
  }, [renderIterationRef.current]);

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
