// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { motion, useAnimationControls } from 'framer-motion';
import Lottie from 'react-lottie';
import React, { useEffect, useState } from 'react';
import { useTips } from 'contexts/Tips';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ItemsWrapper, ItemWrapper, ItemInnerWrapper } from './Wrappers';

export const ItemsInner = ({ items, page }: any) => {
  const controls = useAnimationControls();

  // stores whether this is the initial display of tips
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    doControls(true);
    setInitial(false);
  }, [page]);

  const doControls = async (transition: boolean) => {
    if (transition) {
      controls.set('hidden');
      controls.start('show');
    } else {
      controls.set('show');
    }
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
      {items.map((item: any, index: number) => (
        <Item
          key={`tip_${index}_${page}`}
          index={index}
          {...item}
          controls={controls}
          initial={initial}
        />
      ))}
    </ItemsWrapper>
  );
};

const Item = ({ id, title, subtitle, icon, index, controls, initial }: any) => {
  const { openTipWith } = useTips();

  const [isStopped, setIsStopped] = useState(true);

  useEffect(() => {
    const delay = index * 75;

    if (initial) {
      setTimeout(() => {
        if (isStopped) {
          setIsStopped(false);
        }
      }, delay);
    }
  }, []);

  const animateOptions = {
    loop: false,
    autoplay: false,
    animationData: icon,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <ItemWrapper
      animate={controls}
      custom={index}
      transition={{
        delay: index * 0.2,
        duration: 0.7,
        type: 'spring',
        bounce: 0.35,
      }}
      variants={{
        hidden: {
          y: 15,
        },
        show: {
          y: 0,
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
          <div className="title">
            <h3>{title}</h3>
          </div>
          <div className="desc">
            <h4>
              {subtitle}
              <motion.button
                whileHover={{ scale: 1.03 }}
                onClick={() => openTipWith(id, {})}
                type="button"
                className="more"
              >
                More
                <FontAwesomeIcon icon={faChevronRight} transform="shrink-2" />
              </motion.button>
            </h4>
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
