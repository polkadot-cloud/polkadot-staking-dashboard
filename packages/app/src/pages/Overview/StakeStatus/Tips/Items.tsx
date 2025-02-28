// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAnimationControls } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePrompt } from 'contexts/Prompt';
import { Tip } from 'library/Tips/Tip';
import { ItemInnerWrapper, ItemWrapper, ItemsWrapper } from './Wrappers';
import type { TipDisplayWithControls, TipItemsProps } from './types';

export const Items = ({ items, page }: TipItemsProps) => {
  const controls = useAnimationControls();

  // stores whether this is the initial display of tips
  const [initial, setInitial] = useState<boolean>(true);

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
      {items.map((item, index: number) => (
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

const Item = ({
  title,
  subtitle,
  description,
  index,
  controls,
  initial,
  page,
}: TipDisplayWithControls) => {
  const { openPromptWith } = usePrompt();
  const [isStopped, setIsStopped] = useState<boolean>(true);

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
          <div className="desc active">
            <button
              onClick={() =>
                openPromptWith(
                  <Tip title={title} description={description} page={page} />,
                  'large'
                )
              }
              type="button"
            >
              <h4>
                {subtitle}
                <FontAwesomeIcon
                  icon={faExternalLinkAlt}
                  transform="shrink-2"
                />
              </h4>
            </button>
          </div>
        </section>
      </ItemInnerWrapper>
    </ItemWrapper>
  );
};
