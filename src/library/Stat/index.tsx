// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ButtonHelp,
  ButtonPrimary,
  ButtonSecondary,
  Odometer,
  AccountCard,
} from '@polkadot-cloud/react';
import { applyWidthAsPadding, minDecimalPlaces } from '@polkadot-cloud/utils';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useHelp } from 'contexts/Help';
import { useNotifications } from 'contexts/Notifications';
import { useNetwork } from 'contexts/Network';
import { Wrapper } from './Wrapper';
import type { StatAddress, StatProps } from './types';

export const Stat = ({
  label,
  stat,
  buttons,
  helpKey,
  icon,
  copy,
  type = 'string',
  buttonType = 'primary',
}: StatProps) => {
  const {
    brand: { token: Token },
  } = useNetwork().networkData;
  const { openHelp } = useHelp();
  const { addNotification } = useNotifications();

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

  const Button = buttonType === 'primary' ? ButtonPrimary : ButtonSecondary;

  let display;
  switch (type) {
    case 'address':
      display = stat.display;
      break;
    case 'odometer':
      display = (
        <h2>
          <Token
            style={{
              width: '1.9rem',
              height: '1.9rem',
              marginRight: '0.55rem',
            }}
          />
          <Odometer
            value={minDecimalPlaces(stat.value, 2)}
            spaceAfter="0.4rem"
            zeroDecimals={2}
          />
          {stat?.unit ? stat.unit : null}
        </h2>
      );
      break;
    default:
      display = stat;
  }

  return (
    <Wrapper $isAddress={type === 'address'}>
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
          {type === 'address' ? (
            <AccountCard
              noCard
              icon={{
                size: 26,
                gridSize: 1,
                justify: 'flex-start',
              }}
              title={{
                address: (stat as StatAddress)?.address || '',
                name: display || '',
                justify: 'flex-start',
                align: 'center',
                style: {
                  padding: '0 0.3rem 0.5rem 0.4rem',
                  width: '30rem',
                },
              }}
              fontSize="1.4rem"
            />
          ) : (
            display
          )}
          {buttons ? (
            <span ref={subjectRef}>
              {buttons.map((btn: any, index: number) => (
                <React.Fragment key={`stat_${index}`}>
                  <Button
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
