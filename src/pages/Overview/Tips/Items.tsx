// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useOverlay } from 'contexts/Overlay';
import { motion, useAnimationControls } from 'framer-motion';
import { Tip } from 'library/Tips/Tip';
import React, { useEffect, useState } from 'react';
import { ItemInnerWrapper, ItemsWrapper, ItemWrapper } from './Wrappers';

export const ItemsInner = ({ items, page, showTitle }: any) => {
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
          showTitle={showTitle}
        />
      ))}
    </ItemsWrapper>
  );
};

const Item = ({
  title,
  subtitle,
  description,
  index,
  controls,
  initial,
  showTitle,
}: any) => {
  const { openOverlayWith } = useOverlay();
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
        <section />
        <section>
          {showTitle ? (
            <div className="title">
              <h3>{title}</h3>
            </div>
          ) : null}
          <div className="desc">
            <h4>
              {subtitle}
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() =>
                  openOverlayWith(
                    <Tip title={title} description={description} />,
                    'large'
                  )
                }
                type="button"
                className="more"
              >
                <FontAwesomeIcon
                  icon={faExternalLinkAlt}
                  transform="shrink-1"
                />
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
