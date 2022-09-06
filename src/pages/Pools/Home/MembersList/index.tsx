// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { List, Header, Wrapper as ListWrapper } from 'library/List';
import { useApi } from 'contexts/Api';
import { useNetworkMetrics } from 'contexts/Network';
import { LIST_ITEMS_PER_PAGE, LIST_ITEMS_PER_BATCH } from 'consts';
import { networkColors } from 'theme/default';
import { useTheme } from 'contexts/Themes';
import { AnyApi } from 'types';
import { MotionContainer } from 'library/List/MotionContainer';
import { Pagination } from 'library/List/Pagination';
import { useList, ListProvider } from 'library/List/context';
import { Selectable } from 'library/List/Selectable';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
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
  const [fetched, setFetched] = useState<boolean>(false);

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
      setFetched(false);
    }
  }, [props.members]);

  // configure list when network is ready to fetch
  useEffect(() => {
    if (isReady && metrics.activeEra.index !== 0 && !fetched) {
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
    setFetched(true);
    setMembersDefault(props.members);
    setMembers(props.members);
    fetchPoolMembersMetaBatch(batchKey, props.members, false);
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
                  member={member}
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
