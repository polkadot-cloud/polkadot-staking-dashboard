// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faChevronCircleLeft,
  faChevronCircleRight,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TIPS_CONFIG } from 'config/tips';
import { TipsThresholdMedium, TipsThresholdSmall } from 'consts';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useActivePools } from 'contexts/Pools/ActivePools';
import { usePoolMemberships } from 'contexts/Pools/PoolMemberships';
import { useStaking } from 'contexts/Staking';
import { useTips } from 'contexts/Tips';
import { useTransferOptions } from 'contexts/TransferOptions';
import { useUi } from 'contexts/UI';
import { CardHeaderWrapper, CardWrapper } from 'library/Graphs/Wrappers';
import useFillVariables from 'library/Hooks/useFillVariables';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import throttle from 'lodash.throttle';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnyJson } from 'types';
import { setStateWithRef } from 'Utils';
import { Items } from './Items';
import { Syncing } from './Syncing';
import { PageToggleWrapper } from './Wrappers';

export const Tips = () => {
  const { network } = useApi();
  const { activeAccount } = useConnect();
  const { networkSyncing } = useUi();
  const { toggleDismiss } = useTips();
  const { fillVariables } = useFillVariables();
  const { membership } = usePoolMemberships();
  const { isNominating, staking } = useStaking();
  const { isOwner } = useActivePools();
  const { getTransferOptions } = useTransferOptions();
  const { minNominatorBond } = staking;
  const transferOptions = getTransferOptions(activeAccount);
  const { t, i18n } = useTranslation('tips');

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
  let items = TIPS_CONFIG.filter((i: AnyJson) =>
    segments.includes(i.meta.segment)
  );

  items = items.map((i: any) => {
    const { localeKey } = i;

    return fillVariables(
      {
        ...i,
        title: t(`${localeKey}.title`),
        subtitle: t(`${localeKey}.subtitle`),
        description: i18n.getResource(
          i18n.resolvedLanguage,
          'tips',
          `${localeKey}.description`
        ),
      },
      ['title', 'subtitle', 'description']
    );
  });

  // determine items to be displayed
  const endItem = networkSyncing
    ? 1
    : Math.min(_page * _itemsPerPage, items.length);
  const startItem = networkSyncing
    ? 1
    : _page * _itemsPerPage - (_itemsPerPage - 1);

  const totalItems = networkSyncing ? 1 : items.length;
  const itemsDisplay = items.slice(startItem - 1, endItem);
  const totalPages = Math.ceil(totalItems / _itemsPerPage);

  return (
    <CardWrapper>
      <CardHeaderWrapper withAction>
        <h4>
          Tips
          <OpenHelpIcon helpKey="Dashboard Tips" />
        </h4>
        <div>
          <PageToggleWrapper>
            <button
              type="button"
              disabled={totalPages === 1 || _page === 1}
              onClick={() => {
                setStateWithRef(_page - 1, setPage, pageRef);
              }}
            >
              <FontAwesomeIcon
                icon={faChevronCircleLeft}
                className="icon"
                transform="grow-1"
              />
            </button>
            <h4 className={totalPages === 1 ? `disabled` : undefined}>
              <span>
                {startItem}
                {_itemsPerPage > 1 &&
                  totalItems > 1 &&
                  startItem !== endItem &&
                  ` - ${endItem}`}
              </span>
              {totalPages > 1 && (
                <>
                  of <span>{items.length}</span>
                </>
              )}
            </h4>
            <button
              type="button"
              disabled={totalPages === 1 || _page === totalPages}
              onClick={() => {
                setStateWithRef(_page + 1, setPage, pageRef);
              }}
            >
              <FontAwesomeIcon
                icon={faChevronCircleRight}
                className="icon"
                transform="grow-1"
              />
            </button>
          </PageToggleWrapper>
          <PageToggleWrapper>
            <button
              type="button"
              onClick={() => {
                toggleDismiss(true);
              }}
            >
              <FontAwesomeIcon icon={faCog} />
            </button>
          </PageToggleWrapper>
        </div>
      </CardHeaderWrapper>
      {networkSyncing ? (
        <Syncing />
      ) : (
        <Items items={itemsDisplay} page={pageRef.current} />
      )}
    </CardWrapper>
  );
};
