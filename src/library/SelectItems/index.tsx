// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { MutableRefObject, ReactElement, ReactNode } from 'react';
import {
  Fragment,
  cloneElement,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import type { AnyJson } from 'types';
import { SelectItemsWrapper, TwoThreshold } from './Wrapper';
import type { SelectItemsProps } from './types';

export const SelectItems = ({ layout, children }: SelectItemsProps) => {
  // Initialise refs for container and body of items.
  const containerRefs: MutableRefObject<HTMLDivElement | null>[] = [];
  const bodyRefs: MutableRefObject<HTMLDivElement | null>[] = [];

  if (children) {
    children.forEach(() => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      bodyRefs.push(useRef(null));
      // eslint-disable-next-line react-hooks/rules-of-hooks
      containerRefs.push(useRef(null));
    });
  }

  // Adjust all container heights to be uniform.
  const handleAdjustHeight = () => {
    const refsInitialised = [...containerRefs]
      .concat(bodyRefs)
      .every((r: AnyJson) => r !== null);

    if (refsInitialised) {
      // Get max height from button refs.
      let maxHeight = 0;
      for (const { current: currentBody } of bodyRefs) {
        const thisHeight = currentBody?.offsetHeight || 0;
        if (thisHeight > maxHeight) {
          maxHeight = thisHeight;
        }
      }

      // Update container heights to max height.
      let i = 0;
      for (const { current: currentContainer } of containerRefs) {
        if (currentContainer) {
          const icon: AnyJson = currentContainer.querySelector('.icon');
          const toggle: AnyJson = currentContainer.querySelector('.toggle');

          if (window.innerWidth <= TwoThreshold) {
            currentContainer.style.height = `${
              bodyRefs[i].current?.offsetHeight || 0
            }px`;
            if (icon) {
              icon.style.height = `${bodyRefs[i].current?.offsetHeight || 0}px`;
            }
            if (toggle) {
              toggle.style.height = `${
                bodyRefs[i].current?.offsetHeight || 0
              }px`;
            }
          } else {
            currentContainer.style.height = `${maxHeight}px`;
            if (icon) {
              icon.style.height = `${maxHeight}px`;
            }
            if (toggle) {
              toggle.style.height = `${maxHeight}px`;
            }
          }
        }
        i++;
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
        ? children.map((child: ReactNode, i: number) => {
            if (child !== undefined) {
              return (
                <Fragment key={`select_${i}`}>
                  {cloneElement(child as ReactElement, {
                    bodyRef: bodyRefs[i],
                    containerRef: containerRefs[i],
                  })}
                </Fragment>
              );
            }
            return null;
          })
        : null}
    </SelectItemsWrapper>
  );
};
