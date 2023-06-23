// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isNotZero } from '@polkadotcloud/utils';
import { ListItemsPerBatch, ListItemsPerPage } from 'consts';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useTheme } from 'contexts/Themes';
import { motion } from 'framer-motion';
import { Header, List, Wrapper as ListWrapper } from 'library/List';
import { MotionContainer } from 'library/List/MotionContainer';
import { Pagination } from 'library/List/Pagination';
import { Selectable } from 'library/List/Selectable';
import { ListProvider, useList } from 'library/List/context';
import { useEffect, useRef, useState } from 'react';
import type { AnyApi, Sync } from 'types';
import { Member } from './Member';

export const MembersListInner = ({
  allowMoreCols,
  pagination,
  selectable,
  batchKey,
  onSelected,
  title,
  members: initialMembers,
  disableThrottle = false,
  actions = [],
}: any) => {
  const { mode } = useTheme();
  const provider = useList();
  const {
    isReady,
    network: { colors },
  } = useApi();
  const { activeEra } = useNetworkMetrics();
  const { fetchPoolMembersMetaBatch } = usePoolMembers();

  // get list provider properties.
  const { selected, listFormat, setListFormat } = provider;

  // get actions
  const actionsAll = [...actions].filter((action) => !action.onSelected);
  const actionsSelected = [...actions].filter(
    (action: any) => action.onSelected
  );

  // current page
  const [page, setPage] = useState<number>(1);

  // current render iteration
  const [renderIteration, _setRenderIteration] = useState<number>(1);

  // default list of validators
  const [membersDefault, setMembersDefault] = useState(initialMembers);

  // manipulated list (ordering, filtering) of payouts
  const [members, setMembers] = useState(initialMembers);

  // is this the initial fetch
  const [fetched, setFetched] = useState<Sync>('unsynced');

  // render throttle iteration
  const renderIterationRef = useRef(renderIteration);
  const setRenderIteration = (iter: number) => {
    renderIterationRef.current = iter;
    _setRenderIteration(iter);
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

  // refetch list when list changes
  useEffect(() => {
    if (initialMembers !== membersDefault) {
      setFetched('unsynced');
    }
  }, [initialMembers]);

  // configure list when network is ready to fetch
  useEffect(() => {
    if (isReady && isNotZero(activeEra.index) && fetched === 'unsynced') {
      setupMembersList();
    }
  }, [isReady, fetched, activeEra.index]);

  // render throttle
  useEffect(() => {
    if (!(batchEnd >= pageEnd || disableThrottle)) {
      setTimeout(() => {
        setRenderIteration(renderIterationRef.current + 1);
      }, 500);
    }
  }, [renderIterationRef.current]);

  // trigger onSelected when selection changes
  useEffect(() => {
    if (onSelected) {
      onSelected(provider);
    }
  }, [selected]);

  // handle validator list bootstrapping
  const setupMembersList = () => {
    setMembersDefault(initialMembers);
    setMembers(initialMembers);
    fetchPoolMembersMetaBatch(batchKey, initialMembers, false);
    setFetched('synced');
  };

  // get list items to render
  let listMembers = [];

  // get throttled subset or entire list
  if (!disableThrottle) {
    listMembers = members.slice(pageStart).slice(0, ListItemsPerPage);
  } else {
    listMembers = members;
  }

  if (!members.length) {
    return <></>;
  }

  return (
    <ListWrapper>
      <Header>
        <div>
          <h4>{title}</h4>
        </div>
        <div>
          <button type="button" onClick={() => setListFormat('row')}>
            <FontAwesomeIcon
              icon={faBars}
              color={listFormat === 'row' ? colors.primary[mode] : 'inherit'}
            />
          </button>
          <button type="button" onClick={() => setListFormat('col')}>
            <FontAwesomeIcon
              icon={faGripVertical}
              color={listFormat === 'col' ? colors.primary[mode] : 'inherit'}
            />
          </button>
        </div>
      </Header>
      <List $flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}>
        {listMembers.length > 0 && pagination && (
          <Pagination page={page} total={totalPages} setter={setPage} />
        )}
        {selectable && (
          <Selectable
            actionsAll={actionsAll}
            actionsSelected={actionsSelected}
          />
        )}
        <MotionContainer>
          {listMembers.map((member: AnyApi, index: number) => {
            // fetch batch data by referring to default list index.
            const batchIndex = membersDefault.indexOf(member);

            return (
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
                  batchIndex={batchIndex}
                />
              </motion.div>
            );
          })}
        </MotionContainer>
      </List>
    </ListWrapper>
  );
};

export const MembersList = (props: any) => {
  const { selectActive, selectToggleable } = props;

  return (
    <ListProvider
      selectActive={selectActive}
      selectToggleable={selectToggleable}
    >
      <MembersListInner {...props} />
    </ListProvider>
  );
};
