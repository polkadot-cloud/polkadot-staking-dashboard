
import { useAnimationControls } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { ItemsWrapper } from './Wrappers';
import { Item } from './Item';

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