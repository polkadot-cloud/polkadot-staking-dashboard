// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CardWrapper, CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import * as infoJson from 'img/json/info-outline.json';
import * as helpCenterJson from 'img/json/help-center-outline.json';
import { useEffect, useState, useRef } from 'react';
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { setStateWithRef } from 'Utils';
import throttle from 'lodash.throttle';
import { PageToggleWrapper } from './Wrappers';
import { ItemsOuter } from './ItemsOuter';

export const Tips = () => {
  // helper function to determine the number of items to display per page
  const getItemsPerPage = () => {
    if (window.innerWidth < 750) {
      return 1;
    }
    if (window.innerWidth >= 750 && window.innerWidth < 1200) {
      return 2;
    }
    return 3;
  };

  // helper function to determine which page we should be on upon page resize.
  // This function ensures totalPages is never surpassed, but does not guarantee
  // that the start item will maintain across resizes.
  const getPage = () => {
    const itemsPerPage = getItemsPerPage();
    const totalPages = Math.ceil(items.length / itemsPerPage);
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

  // configure help items
  const items = [
    {
      title: '1. How would you like to stake?',
      subtitle:
        'Becoming a nominator or joining a pool - which one is right for you.',
      icon: helpCenterJson,
    },
    {
      title: '2. Managing your Nominations',
      subtitle:
        'You are now staking. Read more about managing your nominations.',
      icon: infoJson,
    },
    {
      title: '3. Reviewing Payouts',
      subtitle: 'Learn who your best performing nominees are, and update them.',
      icon: infoJson,
    },
    {
      title: '4. How would you like to stake?',
      subtitle:
        'Becoming a nominator or joining a pool - which one is right for you.',
      icon: helpCenterJson,
    },
    {
      title: '5. Managing your Nominations',
      subtitle:
        'You are now staking. Read more about managing your nominations.',
      icon: infoJson,
    },
    {
      title: '6. Reviewing Payouts',
      subtitle: 'Learn who your best performing nominees are, and update them.',
      icon: infoJson,
    },
  ];

  // determine items to be displayed
  const endItem = _page * _itemsPerPage;
  const startItem = endItem - (_itemsPerPage - 1);

  const itemsDisplay = items.slice(startItem - 1, endItem);
  const totalPages = Math.ceil(items.length / _itemsPerPage);

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
                {startItem} {_itemsPerPage > 1 && ` - ${endItem}`}
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
        </div>
      </CardHeaderWrapper>
      <ItemsOuter items={itemsDisplay} />
    </CardWrapper>
  );
};
