// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CardWrapper, CardHeaderWrapper } from 'library/Graphs/Wrappers';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import * as infoJson from 'img/json/info-outline.json';
import * as helpCenterJson from 'img/json/help-center-outline.json';
import Lottie from 'react-lottie';
import { useEffect, useState } from 'react';
import { ItemsWrapper, ItemWrapper } from './Wrappers';

export const Tips = () => {
  return (
    <CardWrapper>
      <CardHeaderWrapper>
        <h4>
          Tips
          <OpenHelpIcon helpKey="Dashboard Tips" />
        </h4>
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
        <Item
          title="How would you like to stake?"
          subtitle="Becoming a nominator or joining a pool - which one is right for you."
          icon={helpCenterJson}
          index={1}
        />
        <Item
          title="Managing your Nominations"
          subtitle="You are now staking. Read more about managing your nominations."
          icon={infoJson}
          index={2}
        />
        <Item
          title="Reviewing Payouts"
          subtitle="Learn who your best performing nominees are, and update them."
          icon={infoJson}
          index={3}
        />
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
