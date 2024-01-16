// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ButtonHelp,
  ButtonPrimary,
  ButtonSecondary,
  Polkicon,
  Odometer,
} from '@polkadot-cloud/react';
import { applyWidthAsPadding, minDecimalPlaces } from '@polkadot-cloud/utils';
import { Fragment, useEffect, useLayoutEffect, useRef } from 'react';
import { useHelp } from 'contexts/Help';
import { useNetwork } from 'contexts/Network';
import { Wrapper } from './Wrapper';
import type { StatAddress, StatProps } from './types';
import { NotificationsController } from 'static/NotificationsController';
import type { AnyJson } from 'types';

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
              NotificationsController.emit(copy.notification);
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
            <div className="identicon">
              <Polkicon
                address={(stat as StatAddress)?.address || ''}
                size="2.4rem"
              />
            </div>
          ) : null}
          {display}
          {buttons ? (
            <span ref={subjectRef}>
              {buttons.map((btn: AnyJson, index: number) => (
                <Fragment key={`stat_${index}`}>
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
                </Fragment>
              ))}
            </span>
          ) : null}
        </div>
      </div>
    </Wrapper>
  );
};
