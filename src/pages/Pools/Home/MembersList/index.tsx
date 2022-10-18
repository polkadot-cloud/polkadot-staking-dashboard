// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LIST_ITEMS_PER_BATCH, LIST_ITEMS_PER_PAGE } from 'consts';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { useTheme } from 'contexts/Themes';
import { motion } from 'framer-motion';
import { Header, List, Wrapper as ListWrapper } from 'library/List';
import { ListProvider, useList } from 'library/List/context';
import { MotionContainer } from 'library/List/MotionContainer';
import { Pagination } from 'library/List/Pagination';
import { Selectable } from 'library/List/Selectable';
import { useEffect, useRef, useState } from 'react';
import { networkColors } from 'theme/default';
import { AnyApi, Sync } from 'types';
import { Member } from './Member';

export const MembersListInner = (props: any) => {
  const { allowMoreCols, pagination, selectable, batchKey } = props;

  const actions = props.actions ?? [];

  const { mode } = useTheme();
  const provider = useList();
  const { isReady, network } = useApi();
  const { metrics } = useNetworkMetrics();
  const { fetchPoolMembersMetaBatch } = usePoolMembers();

  // get list provider props
  const { selected, listFormat, setListFormat } = provider;

  // get actions
  const actionsAll = [...actions].filter((action) => !action.onSelected);
  const actionsSelected = [...actions].filter(
    (action: any) => action.onSelected
  );

  const disableThrottle = props.disableThrottle ?? false;

  // current page
  const [page, setPage] = useState<number>(1);

  // current render iteration
  const [renderIteration, _setRenderIteration] = useState<number>(1);

  // default list of validators
  const [membersDefault, setMembersDefault] = useState(props.members);

  // manipulated list (ordering, filtering) of payouts
  const [members, setMembers] = useState(props.members);

  // is this the initial fetch
  const [fetched, setFetched] = useState<Sync>(Sync.Unsynced);

  // render throttle iteration
  const renderIterationRef = useRef(renderIteration);
  const setRenderIteration = (iter: number) => {
    renderIterationRef.current = iter;
    _setRenderIteration(iter);
  };

  // pagination
  const totalPages = Math.ceil(members.length / LIST_ITEMS_PER_PAGE);
  const pageEnd = page * LIST_ITEMS_PER_PAGE - 1;
  const pageStart = pageEnd - (LIST_ITEMS_PER_PAGE - 1);

  // render batch
  const batchEnd = renderIteration * LIST_ITEMS_PER_BATCH - 1;

  // refetch list when list changes
  useEffect(() => {
    if (props.members !== membersDefault) {
      setFetched(Sync.Unsynced);
    }
  }, [props.members]);

  // configure list when network is ready to fetch
  useEffect(() => {
    if (isReady && metrics.activeEra.index !== 0 && fetched === Sync.Unsynced) {
      setupMembersList();
    }
  }, [isReady, fetched, metrics.activeEra.index]);

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
    if (props.onSelected) {
      props.onSelected(provider);
    }
  }, [selected]);

  // handle validator list bootstrapping
  const setupMembersList = () => {
    setMembersDefault(props.members);
    setMembers(props.members);
    fetchPoolMembersMetaBatch(batchKey, props.members, false);
    setFetched(Sync.Synced);
  };

  // get list items to render
  let listMembers = [];

  // get throttled subset or entire list
  if (!disableThrottle) {
    listMembers = members.slice(pageStart).slice(0, LIST_ITEMS_PER_PAGE);
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
          <h4>{props.title}</h4>
        </div>
        <div>
          <button type="button" onClick={() => setListFormat('row')}>
            <FontAwesomeIcon
              icon={faBars}
              color={
                listFormat === 'row'
                  ? networkColors[`${network.name}-${mode}`]
                  : 'inherit'
              }
            />
          </button>
          <button type="button" onClick={() => setListFormat('col')}>
            <FontAwesomeIcon
              icon={faGripVertical}
              color={
                listFormat === 'col'
                  ? networkColors[`${network.name}-${mode}`]
                  : 'inherit'
              }
            />
          </button>
        </div>
      </Header>
      <List flexBasisLarge={allowMoreCols ? '33.33%' : '50%'}>
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
