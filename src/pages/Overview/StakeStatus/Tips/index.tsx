// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@polkadot-cloud/utils';
import throttle from 'lodash.throttle';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TipsConfig } from 'config/tips';
import { DefaultLocale, TipsThresholdMedium, TipsThresholdSmall } from 'consts';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { useFillVariables } from 'library/Hooks/useFillVariables';
import type { AnyJson } from 'types';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Items } from './Items';
import { PageToggle } from './PageToggle';
import { Syncing } from './Syncing';
import { TipsWrapper } from './Wrappers';
import type { TipDisplay } from './types';
import { useApi } from 'contexts/Api';

export const Tips = () => {
  const { i18n, t } = useTranslation();
  const { network } = useNetwork();
  const { isNetworkSyncing } = useUi();
  const { activeAccount } = useActiveAccounts();
  const { fillVariables } = useFillVariables();
  const { membership } = usePoolMemberships();
  const {
    stakingMetrics: { minNominatorBond },
  } = useApi();

  const { isNominating } = useStaking();
  const { isOwner } = useActivePools();
  const { feeReserve, getTransferOptions } = useTransferOptions();
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
    const totalItmes = isNetworkSyncing ? 1 : items.length;
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
    setStateWithRef(getItemsPerPage(), setItemsPerPageState, itemsPerPageRef);
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
  const [itemsPerPage, setItemsPerPageState] =
    useState<number>(getItemsPerPage());
  const itemsPerPageRef = useRef(itemsPerPage);

  // store the current page
  const [page, setPage] = useState<number>(1);
  const pageRef = useRef(page);

  // accumulate segments to include in tips
  const segments: AnyJson = [];
  if (!activeAccount) {
    segments.push(1);
  } else if (!isNominating() && !membership) {
    if (
      transferOptions.freeBalance
        .minus(feeReserve)
        .isGreaterThan(minNominatorBond)
    ) {
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
  let items = TipsConfig.filter((i) => segments.includes(i.s));

  items = items.map((item) => {
    const { id } = item;

    return fillVariables(
      {
        ...item,
        title: t(`${id}.0`, { ns: 'tips' }),
        subtitle: t(`${id}.1`, { ns: 'tips' }),
        description: i18n.getResource(
          i18n.resolvedLanguage ?? DefaultLocale,
          'tips',
          `${id}.2`
        ),
      },
      ['title', 'subtitle', 'description']
    );
  });

  // determine items to be displayed
  const end = isNetworkSyncing
    ? 1
    : Math.min(pageRef.current * itemsPerPageRef.current, items.length);
  const start = isNetworkSyncing
    ? 1
    : pageRef.current * itemsPerPageRef.current - (itemsPerPageRef.current - 1);

  const itemsDisplay = items.slice(start - 1, end) as TipDisplay[];

  const setPageHandler = (newPage: number) => {
    setStateWithRef(newPage, setPage, pageRef);
  };
  return (
    <TipsWrapper>
      <div style={{ flexGrow: 1 }}>
        {isNetworkSyncing ? (
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
