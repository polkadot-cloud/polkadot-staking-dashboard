// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { DefinitionWrapper } from '../Wrappers';
import type { DefinitionProps } from './types';

export const Definition = ({ title, description }: DefinitionProps) => {
  // Store whether the definition is open or not.
  const [open, setOpen] = useState<boolean>(false);

  // Store the current height of the definition content.
  const [height, setHeight] = useState<number>(0);

  const contentRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const h = contentRef?.current?.clientHeight || 0;
    setHeight(h);
  }, [open]);

  return (
    <DefinitionWrapper>
      <button onClick={() => setOpen(!open)} type="button">
        <h2>
          {title}
          <span>{open ? '-' : '+'}</span>
        </h2>
      </button>

      <div style={{ height }}>
        <div className="content" ref={contentRef}>
          {open && (
            <>
              {description.map((item, index: number) => (
                <h4 key={`inner_def_${index}`} className="definition">
                  {item}
                </h4>
              ))}
            </>
          )}
        </div>
      </div>
    </DefinitionWrapper>
  );
};
