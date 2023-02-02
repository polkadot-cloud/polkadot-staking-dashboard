// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonPrimary } from '@rossbulat/polkadot-dashboard-ui';
import { OpenHelpIcon } from 'library/OpenHelpIcon';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { applyWidthAsPadding } from 'Utils';
import { StatProps } from './types';
import { Wrapper } from './Wrapper';

export const Stat = ({ label, stat, buttons, helpKey, icon }: StatProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLDivElement>(null);

  const handleAdjustLayout = () => {
    applyWidthAsPadding(subjectRef, containerRef);
  };

  useLayoutEffect(() => {
    handleAdjustLayout();
  });

  useEffect(() => {
    window.addEventListener('resize', handleAdjustLayout);
    return () => {
      window.removeEventListener('resize', handleAdjustLayout);
    };
  }, []);

  return (
    <Wrapper>
      <h4>
        {label} {helpKey !== undefined && <OpenHelpIcon helpKey={helpKey} />}
      </h4>
      <div className="content">
        <div className="text" ref={containerRef}>
          {icon && (
            <>
              <FontAwesomeIcon icon={icon} transform="shrink-4" />
              &nbsp;
            </>
          )}
          {stat}
          {buttons && (
            <span ref={subjectRef}>
              {buttons.map((btn: any, index: number) => (
                <React.Fragment key={`stat_${index}`}>
                  <ButtonPrimary
                    key={`btn_${index}_${Math.random()}`}
                    text={btn.title}
                    lg={btn.large ?? undefined}
                    iconLeft={btn.icon ?? undefined}
                    iconTransform={btn.transform ?? undefined}
                    disabled={btn.disabled ?? false}
                    onClick={() => btn.onClick()}
                  />
                  &nbsp;&nbsp;
                </React.Fragment>
              ))}
            </span>
          )}
        </div>
      </div>
    </Wrapper>
  );
};
