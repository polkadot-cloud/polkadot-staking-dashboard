// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ButtonHelp, ButtonPrimary } from '@polkadotcloud/core-ui';
import { applyWidthAsPadding } from 'Utils';
import { useHelp } from 'contexts/Help';
import { useNotifications } from 'contexts/Notifications';
import { Identicon } from 'library/Identicon';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Wrapper } from './Wrapper';
import type { StatAddress, StatProps } from './types';

export const Stat = ({
  label,
  stat,
  buttons,
  helpKey,
  icon,
  copy,
}: StatProps) => {
  const { addNotification } = useNotifications();
  const { openHelp } = useHelp();

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

  let display;
  let isAddress;
  if (typeof stat === 'string') {
    display = stat;
    isAddress = false;
  } else {
    display = stat.display;
    isAddress = true;
  }

  return (
    <Wrapper isAddress={isAddress}>
      <h4>
        {label}
        {helpKey !== undefined ? (
          <ButtonHelp marginLeft onClick={() => openHelp(helpKey)} />
        ) : null}
        {copy !== undefined ? (
          <button
            type="button"
            className="btn"
            onClick={() => {
              addNotification(copy.notification);
              navigator.clipboard.writeText(copy.content);
            }}
          >
            <FontAwesomeIcon icon={faCopy} transform="shrink-4" />
          </button>
        ) : null}
      </h4>
      <div className="content">
        <div className="text" ref={containerRef}>
          {icon ? (
            <>
              <FontAwesomeIcon icon={icon} transform="shrink-4" />
              &nbsp;
            </>
          ) : null}
          {isAddress ? (
            <div className="identicon">
              <Identicon
                value={(stat as StatAddress)?.address || ''}
                size={26}
              />
            </div>
          ) : null}
          {display}
          {buttons ? (
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
          ) : null}
        </div>
      </div>
    </Wrapper>
  );
};
