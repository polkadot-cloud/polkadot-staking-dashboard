// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TIPS_CONFIG } from 'config/tips';
import { TipsThresholdMedium, TipsThresholdSmall } from 'consts';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import useFillVariables from 'library/Hooks/useFillVariables';
import throttle from 'lodash.throttle';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyJson } from 'types';
import { setStateWithRef } from 'Utils';
import Items from './Items';
import { PageToggle } from './PageToggle';
import { Syncing } from './Syncing';
import { TipsWrapper } from './Wrappers';

export const Tips = () => {
  const { t, i18n } = useTranslation();
  const { network } = useApi();
  const { activeAccount } = useConnect();
  const { networkSyncing } = useUi();
  const { fillVariables } = useFillVariables();
  const { membership } = usePoolMemberships();
  const { isNominating, staking } = useStaking();
  const { isOwner } = useActivePools();
  const { getTransferOptions } = useTransferOptions();
  const { minNominatorBond } = staking;
  const transferOptions = getTransferOptions(activeAccount);

  // multiple tips per row is currently turned off.
  const multiTipsPerRow = false;

  // helper function to determine the number of items to display per page.
  // UI displays 1 item by default.
  const getItemsPerPage = () => {
    if (!multiTipsPerRow) {
      return 1;
    }
    if (window.innerWidth < TipsThresholdSmall) {
      return 1;
    }
    if (
      window.innerWidth >= TipsThresholdSmall &&
      window.innerWidth < TipsThresholdMedium
    ) {
      return 2;
    }
    return 3;
  };

  // helper function to determine which page we should be on upon page resize.
  // This function ensures totalPages is never surpassed, but does not guarantee
  // that the start item will maintain across resizes.
  const getPage = () => {
    const totalItmes = networkSyncing ? 1 : items.length;
    const itemsPerPage = getItemsPerPage();
    const totalPages = Math.ceil(totalItmes / itemsPerPage);
    if (pageRef.current > totalPages) {
      return totalPages;
    }
    const end = pageRef.current * itemsPerPage;
    const start = end - (itemsPerPage - 1);
    return Math.ceil(start / itemsPerPage);
  };

  // resize callback
  const resizeCallback = () => {
    setStateWithRef(getPage(), setPage, pageRef);
    setStateWithRef(getItemsPerPage(), setItemsPerPage, itemsPerPageRef);
  };

  // throttle resize callback
  const throttledResizeCallback = throttle(resizeCallback, 200, {
    trailing: true,
    leading: false,
  });

  // re-sync page when active account changes
  useEffect(() => {
    setStateWithRef(getPage(), setPage, pageRef);
  }, [activeAccount, network]);

  // resize event listener
  useEffect(() => {
    window.addEventListener('resize', throttledResizeCallback);
    return () => {
      window.removeEventListener('resize', throttledResizeCallback);
    };
  }, []);

  // store the current amount of allowed items on display
  const [itemsPerPage, setItemsPerPage] = useState<number>(getItemsPerPage());
  const itemsPerPageRef = useRef(itemsPerPage);

  // store the current page
  const [page, setPage] = useState<number>(1);
  const pageRef = useRef(page);

  const _itemsPerPage = itemsPerPageRef.current;
  const _page = pageRef.current;

  // accumulate segments to include in tips
  const segments: AnyJson = [];
  if (!activeAccount) {
    segments.push(1);
  } else if (!isNominating() && !membership) {
    if (transferOptions.freeBalance.gt(minNominatorBond)) {
      segments.push(2);
    } else {
      segments.push(3);
    }
    segments.push(4);
  } else {
    if (isNominating()) {
      segments.push(5);
    }
    if (membership) {
      if (!isOwner()) {
        segments.push(6);
      } else {
        segments.push(7);
      }
    }
    segments.push(8);
  }

  // filter tips relevant to connected account.
  let items = TIPS_CONFIG.filter((i: AnyJson) => segments.includes(i.s));

  items = items.map((i: any) => {
    const { id } = i;

    return fillVariables(
      {
        ...i,
        title: t(`${id}.0`, { ns: 'tips' }),
        subtitle: t(`${id}.1`, { ns: 'tips' }),
        description: i18n.getResource(i18n.resolvedLanguage, 'tips', `${id}.2`),
      },
      ['title', 'subtitle', 'description']
    );
  });

  // determine items to be displayed
  const end = networkSyncing
    ? 1
    : Math.min(_page * _itemsPerPage, items.length);
  const start = networkSyncing
    ? 1
    : _page * _itemsPerPage - (_itemsPerPage - 1);

  const itemsDisplay = items.slice(start - 1, end);

  const setPageHandler = (newPage: number) => {
    setStateWithRef(newPage, setPage, pageRef);
  };
  return (
    <TipsWrapper>
      <div style={{ flexGrow: 1 }}>
        {networkSyncing ? (
          <Syncing />
        ) : (
          <Items
            items={itemsDisplay}
            page={pageRef.current}
            showTitle={false}
          />
        )}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <PageToggle
          start={start}
          end={end}
          page={page}
          itemsPerPage={itemsPerPage}
          totalItems={items.length}
          setPageHandler={setPageHandler}
        />
      </div>
    </TipsWrapper>
  );
};
