// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CardWrapper, CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import * as infoJson from 'img/json/info-outline.json';
import * as helpCenterJson from 'img/json/help-center-outline.json';
import Lottie from 'react-lottie';
import { useEffect, useState } from 'react';
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemsWrapper, ItemWrapper, PageToggleWrapper } from './Wrappers';

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

  // resize side menu callback
  const resizeCallback = () => {
    setItemsPerPage(getItemsPerPage());
  };

  // resize event listener
  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  // store the current amount of allowed items on display
  const [itemsPerPage, setItemsPerPage] = useState<number>(getItemsPerPage());

  // store the current page
  const [page, setPage] = useState<number>(1);

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
  const endItem = page * itemsPerPage;
  const startItem = endItem - (itemsPerPage - 1);

  const itemsDisplay = items.slice(startItem - 1, endItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

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
              disabled={totalPages === 1 || page === 1}
              onClick={() => {
                setPage(page - 1);
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
                {startItem} {itemsPerPage > 1 && ` - ${endItem}`}
              </span>
              {totalPages > 1 && (
                <>
                  of <span>{items.length}</span>
                </>
              )}
            </h4>
            <button
              type="button"
              disabled={totalPages === 1 || page === totalPages}
              onClick={() => {
                setPage(page + 1);
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
      <ItemsWrapper
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {itemsDisplay.map((item: any, index: number) => (
          <Item key={`tip_${index}`} index={index} {...item} />
        ))}
      </ItemsWrapper>
    </CardWrapper>
  );
};

const Item = ({ title, subtitle, icon, index }: any) => {
  const [isStopped, setIsStopped] = useState(true);

  useEffect(() => {
    const delay = index * 200;
    setTimeout(() => {
      if (isStopped) {
        setIsStopped(false);
      }
    }, delay);
  }, []);

  const animateOptions = {
    loop: true,
    autoplay: false,
    animationData: icon,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <ItemWrapper
      type="button"
      whileHover={{ scale: 1.01 }}
      onClick={() => {
        console.log('interact with tip');
      }}
      transition={{
        type: 'spring',
        bounce: 0.55,
      }}
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
      <div className="inner">
        <section>
          <Lottie
            options={animateOptions}
            width="2.25rem"
            height="2.25rem"
            isStopped={isStopped}
            isPaused={isStopped}
            eventListeners={[
              {
                eventName: 'loopComplete',
                callback: () => setIsStopped(true),
              },
            ]}
          />
        </section>
        <section>
          <h4>{title}</h4>
          <div className="desc">
            <p>{subtitle}</p>
          </div>
        </section>
      </div>
    </ItemWrapper>
  );
};
