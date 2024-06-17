// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { isNotZero } from '@w3ux/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { poolMembersPerPage } from 'library/List/defaults';
import { useApi } from 'contexts/Api';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { List, ListStatusHeader, Wrapper as ListWrapper } from 'library/List';
import { Pagination } from 'library/List/Pagination';
import { ListProvider } from 'library/List/context';
import type { Sync } from '@w3ux/types';
import { Member } from './Member';
import type { DefaultMembersListProps } from './types';
import type { PoolMember } from 'contexts/Pools/PoolMembers/types';
import { MotionContainer } from 'library/List/MotionContainer';

export const MembersListInner = ({
  pagination,
  batchKey,
  members: initialMembers,
}: DefaultMembersListProps) => {
  const { t } = useTranslation('pages');
  const { isReady, activeEra } = useApi();
  const { fetchPoolMembersMetaBatch } = usePoolMembers();

  // current page
  const [page, setPage] = useState<number>(1);

  // default list of validators
  const [membersDefault, setMembersDefault] =
    useState<PoolMember[]>(initialMembers);

  // manipulated list (ordering, filtering) of payouts
  const [members, setMembers] = useState<PoolMember[]>(initialMembers);

  // is this the initial fetch
  const [fetched, setFetched] = useState<Sync>('unsynced');

  // pagination
  const totalPages = Math.ceil(members.length / poolMembersPerPage);
  const pageEnd = page * poolMembersPerPage - 1;
  const pageStart = pageEnd - (poolMembersPerPage - 1);

  // get throttled subset or entire list
  const listMembers = members.slice(pageStart).slice(0, poolMembersPerPage);

  // handle validator list bootstrapping
  const setupMembersList = () => {
    setMembersDefault(initialMembers);
    setMembers(initialMembers);
    fetchPoolMembersMetaBatch(batchKey, initialMembers, false);
    setFetched('synced');
  };

  // Refetch list when list changes.
  useEffect(() => {
    if (initialMembers !== membersDefault) {
      setFetched('unsynced');
    }
  }, [initialMembers]);

  // Configure list when network is ready to fetch.
  useEffect(() => {
    if (isReady && isNotZero(activeEra.index) && fetched === 'unsynced') {
      setupMembersList();
    }
  }, [isReady, fetched, activeEra.index]);

  return !members.length ? null : (
    <ListWrapper>
      <List $flexBasisLarge={'33.33%'}>
        {listMembers.length > 0 && pagination && (
          <Pagination page={page} total={totalPages} setter={setPage} />
        )}
        {fetched !== 'synced' ? (
          <ListStatusHeader style={{ marginTop: '0.5rem' }}>
            {t('pools.fetchingMemberList')}...
          </ListStatusHeader>
        ) : (
          <MotionContainer>
            {listMembers.map((member: PoolMember, index: number) => (
              <Member
                key={`nomination_${index}`}
                who={member.who}
                batchKey={batchKey}
                batchIndex={membersDefault.indexOf(member)}
              />
            ))}
          </MotionContainer>
        )}
      </List>
    </ListWrapper>
  );
};

export const MembersList = (props: DefaultMembersListProps) => {
  const { selectToggleable } = props;
  return (
    <ListProvider selectToggleable={selectToggleable}>
      <MembersListInner {...props} />
    </ListProvider>
  );
};
