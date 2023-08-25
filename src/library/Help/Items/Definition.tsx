// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { DefinitionWrapper } from '../Wrappers';

export const Definition = ({ title, description, open: o }: any) => {
  // Store whether the definition is open or not.
  const [open, setOpen] = useState(o || false);

  // Store the current height of the definition content.
  const [height, setHeight] = useState<number>(0);

  const contentRef: RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const h = contentRef?.current?.clientHeight || 0;
    setHeight(h);
  }, [open]);

  return (
    <DefinitionWrapper>
      {!o ? (
        <button onClick={() => setOpen(!open)} type="button">
          <h2>
            {title}
            <span>{open ? '-' : '+'}</span>
          </h2>
        </button>
      ) : null}
      <div style={{ height }}>
        <div className="content" ref={contentRef}>
          {open ? (
            <>
              {description.map((item: any, index: number) => (
                <h4 key={`inner_def_${index}`} className="definition">
                  {item}
                </h4>
              ))}
            </>
          ) : null}
        </div>
      </div>
    </DefinitionWrapper>
  );
};
