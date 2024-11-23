// Copyright 2024 @polkadot-cloud/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { setStateWithRef } from '@w3ux/utils';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TipsConfig } from 'config/tips';
import { TipsThresholdMedium, TipsThresholdSmall } from 'consts';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { useStaking } from 'contexts/Staking';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useFillVariables } from 'hooks/useFillVariables';
import type { AnyJson } from '@w3ux/types';
import { useNetwork } from 'contexts/Network';
import { useActiveAccounts } from 'contexts/ActiveAccounts';
import { Items } from './Items';
import { PageToggle } from './PageToggle';
import { Syncing } from './Syncing';
import { TipsWrapper } from './Wrappers';
import type { TipDisplay } from './types';
import { useApi } from 'contexts/Api';
import { useBalances } from 'contexts/Balances';
import { useSyncing } from 'hooks/useSyncing';
import { DefaultLocale } from 'locales';
import { useOnResize } from '@w3ux/hooks';

export const Tips = () => {
  const { i18n, t } = useTranslation();
  const { network } = useNetwork();
  const {
    stakingMetrics: { minNominatorBond },
  } = useApi();
  const { isOwner } = useActivePool();
  const { isNominating } = useStaking();
  const { getPoolMembership } = useBalances();
  const { activeAccount } = useActiveAccounts();
  const { fillVariables } = useFillVariables();
  const { syncing } = useSyncing(['initialization']);
  const { feeReserve, getTransferOptions } = useTransferOptions();

  const membership = getPoolMembership(activeAccount);
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
    const totalItmes = syncing ? 1 : items.length;
    const itemsPerPage = getItemsPerPage();
    const totalPages = Math.ceil(totalItmes / itemsPerPage);
    if (pageRef.current > totalPages) {
      return totalPages;
    }
    const end = pageRef.current * itemsPerPage;
    const start = end - (itemsPerPage - 1);
    return Math.ceil(start / itemsPerPage);
  };

  // Re-sync page and items per page on resize.
  useOnResize(() => {
    setStateWithRef(getPage(), setPage, pageRef);
    setStateWithRef(getItemsPerPage(), setItemsPerPageState, itemsPerPageRef);
  });

  // re-sync page when active account changes
  useEffect(() => {
    setStateWithRef(getPage(), setPage, pageRef);
  }, [activeAccount, network]);

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
  const end = syncing
    ? 1
    : Math.min(pageRef.current * itemsPerPageRef.current, items.length);
  const start = syncing
    ? 1
    : pageRef.current * itemsPerPageRef.current - (itemsPerPageRef.current - 1);

  const itemsDisplay = items.slice(start - 1, end) as TipDisplay[];

  const setPageHandler = (newPage: number) => {
    setStateWithRef(newPage, setPage, pageRef);
  };
  return (
    <TipsWrapper>
      <div style={{ flexGrow: 1 }}>
        {syncing ? (
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
