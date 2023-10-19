// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isNotZero } from '@polkadot-cloud/utils';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ListItemsPerBatch, ListItemsPerPage } from 'consts';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/NetworkMetrics';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import type { PoolMember } from 'contexts/Pools/types';
import { useTheme } from 'contexts/Themes';
import {
  Header,
  List,
  ListStatusHeader,
  Wrapper as ListWrapper,
} from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';
import { Pagination } from 'library/List/Pagination';
import { ListProvider, useList } from 'library/List/context';
import type { Sync } from 'types';
import { useNetwork } from 'contexts/Network';
import { Member } from './Member';
import type { DefaultMembersListProps } from './types';

export const MembersListInner = ({
  allowMoreCols,
  pagination,
  batchKey,
  members: initialMembers,
  disableThrottle = false,
}: DefaultMembersListProps) => {
  const { t } = useTranslation('pages');
  const { isReady } = useApi();
  const {
    networkData: { colors },
  } = useNetwork();
  const provider = useList();
  const { mode } = useTheme();
  const { activeEra } = useNetworkMetrics();
  const { fetchPoolMembersMetaBatch } = usePoolMembers();

  // get list provider properties.
  const { listFormat, setListFormat } = provider;

  // current page
  const [page, setPage] = useState<number>(1);

  // current render iteration
  const [renderIteration, setRenderIterationState] = useState<number>(1);

  // default list of validators
  const [membersDefault, setMembersDefault] =
    useState<PoolMember[]>(initialMembers);

  // manipulated list (ordering, filtering) of payouts
  const [members, setMembers] = useState<PoolMember[]>(initialMembers);

  // is this the initial fetch
  const [fetched, setFetched] = useState<Sync>('unsynced');

  // render throttle iteration
  const renderIterationRef = useRef(renderIteration);
  const setRenderIteration = (iter: number) => {
    renderIterationRef.current = iter;
    setRenderIterationState(iter);
  };

  // pagination
  const totalPages = Math.ceil(members.length / ListItemsPerPage);
  const pageEnd = page * ListItemsPerPage - 1;
  const pageStart = pageEnd - (ListItemsPerPage - 1);

  // render batch
  const batchEnd = Math.min(
    renderIteration * ListItemsPerBatch - 1,
    ListItemsPerPage
  );

  // get throttled subset or entire list
  const listMembers = disableThrottle
    ? members
    : members.slice(pageStart).slice(0, ListItemsPerPage);

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

  // Render throttle.
  useEffect(() => {
    if (!(batchEnd >= pageEnd || disableThrottle)) {
      setTimeout(() => {
        setRenderIteration(renderIterationRef.current + 1);
      }, 500);
    }
  }, [renderIterationRef.current]);

  return (
    <>
      {!members.length ? (
        <></>
      ) : (
        <ListWrapper>
          <Header>
            <div />
            <div>
              <button type="button" onClick={() => setListFormat('row')}>
                <FontAwesomeIcon
                  icon={faBars}
                  color={
                    listFormat === 'row' ? colors.primary[mode] : 'inherit'
                  }
                />
              </button>
              <button type="button" onClick={() => setListFormat('col')}>
                <FontAwesomeIcon
                  icon={faGripVertical}
                  color={
                    listFormat === 'col' ? colors.primary[mode] : 'inherit'
                  }
                />
              </button>
            </div>
          </Header>
          <List $flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}>
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
                  <motion.div
                    className={`item ${listFormat === 'row' ? 'row' : 'col'}`}
                    key={`nomination_${index}`}
                    variants={{
                      hidden: {
                        y: 15,
                        opacity: 0,
                      },
                      show: {
                        y: 0,
                        opacity: 1,
                      },
                    }}
                  >
                    <Member
                      who={member.who}
                      batchKey={batchKey}
                      batchIndex={membersDefault.indexOf(member)}
                    />
                  </motion.div>
                ))}
              </MotionContainer>
            )}
          </List>
        </ListWrapper>
      )}
    </>
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
