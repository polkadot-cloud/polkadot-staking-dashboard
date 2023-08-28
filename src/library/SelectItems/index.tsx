// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MutableRefObject } from 'react';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import type { AnyJson } from 'types';
import { SelectItemsWrapper, TwoThreshold } from './Wrapper';
import type { SelectItemsProps } from './types';

export const SelectItems = ({ layout, children }: SelectItemsProps) => {
  // Initialise refs for container and body of items.
  const containerRefs: MutableRefObject<AnyJson>[] = [];
  const bodyRefs: MutableRefObject<AnyJson>[] = [];

  if (children) {
    for (let i = 0; i < children.length; i++) {
      bodyRefs.push(useRef(null));
      containerRefs.push(useRef(null));
    }
  }

  // Adjust all container heights to be uniform.
  const handleAdjustHeight = () => {
    const refsInitialised = [...containerRefs]
      .concat(bodyRefs)
      .every((r: AnyJson) => r !== null);

    if (refsInitialised) {
      // Get max height from button refs.
      let maxHeight = 0;
      for (let i = 0; i < bodyRefs.length; i++) {
        const { current } = bodyRefs[i];
        if (current) {
          const thisHeight = current.offsetHeight || 0;
          if (thisHeight > maxHeight) {
            maxHeight = thisHeight;
          }
        }
      }

      // Update container heights to max height.
      for (let i = 0; i < containerRefs.length; i++) {
        const { current } = containerRefs[i];

        if (current) {
          const icon: AnyJson = current.querySelector('.icon');
          const toggle: AnyJson = current.querySelector('.toggle');

          if (window.innerWidth <= TwoThreshold) {
            current.style.height = `${bodyRefs[i].current.offsetHeight}px`;
            if (icon)
              icon.style.height = `${bodyRefs[i].current.offsetHeight}px`;
            if (toggle)
              toggle.style.height = `${bodyRefs[i].current.offsetHeight}px`;
          } else {
            current.style.height = `${maxHeight}px`;
            if (icon) icon.style.height = `${maxHeight}px`;
            if (toggle) toggle.style.height = `${maxHeight}px`;
          }
        }
      }
    }
  };

  // Update on ref change.
  useLayoutEffect(() => {
    handleAdjustHeight();
  }, [children, bodyRefs, containerRefs]);

  // Adjust height on window resize.
  useEffect(() => {
    window.addEventListener('resize', handleAdjustHeight);
    return () => {
      window.removeEventListener('resize', handleAdjustHeight);
    };
  }, []);

  return (
    <SelectItemsWrapper className={layout}>
      {children
        ? children.map((child: any, i: number) => (
            <React.Fragment key={`select_${i}`}>
              {React.cloneElement(child, {
                bodyRef: bodyRefs[i],
                containerRef: containerRefs[i],
              })}
            </React.Fragment>
          ))
        : null}
    </SelectItemsWrapper>
  );
};
