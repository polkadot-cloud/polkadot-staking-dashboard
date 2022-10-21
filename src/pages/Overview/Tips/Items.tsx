// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import Lottie from 'react-lottie';
import React, { useEffect, useState } from 'react';
import { useAnimationControls } from 'framer-motion';
import { useTips } from 'contexts/Tips';
import { ItemsWrapper, ItemWrapper, ItemInnerWrapper } from './Wrappers';

export const ItemsInner = ({ items }: any) => {
  const [_items, setItems] = useState(items);
  const controls = useAnimationControls();

  useEffect(() => {
    setItems(items);
    doControls();
  }, [items]);

  const doControls = async () => {
    controls.set('hidden');
    controls.start('show');
  };

  return (
    <ItemsWrapper
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
        },
      }}
    >
      {_items.map((item: any, index: number) => (
        <Item
          key={`tip_${index}`}
          index={index}
          {...item}
          controls={controls}
        />
      ))}
    </ItemsWrapper>
  );
};

const Item = ({ id, title, label, subtitle, icon, index, controls }: any) => {
  const { openTipWith } = useTips();

  const [isStopped, setIsStopped] = useState(true);

  useEffect(() => {
    const delay = index * 75;
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
      onClick={() => {
        openTipWith(id, {});
      }}
      animate={controls}
      custom={index}
      transition={{
        delay: index * 0.2,
        duration: 0.25,
        ease: 'easeOut',
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
      <ItemInnerWrapper>
        <section>
          <Lottie
            options={animateOptions}
            width="2.2rem"
            height="2.2rem"
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
          <h4>
            {title} <span>{label}</span>
          </h4>
          <div className="desc">
            <p>{subtitle}</p>
          </div>
        </section>
      </ItemInnerWrapper>
    </ItemWrapper>
  );
};

export class Items extends React.Component<any, any> {
  shouldComponentUpdate(nextProps: any) {
    return JSON.stringify(this.props.items) !== JSON.stringify(nextProps.items);
  }

  render() {
    return <ItemsInner {...this.props} />;
  }
}

export default Items;
