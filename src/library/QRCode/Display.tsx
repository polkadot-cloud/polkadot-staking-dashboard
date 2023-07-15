// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { objectSpread } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { qrcode } from './qrcode.js';
import { createFrames, createImgSize } from './util.js';

interface Props {
  className?: string | undefined;
  size?: string | number | undefined;
  skipEncoding?: boolean;
  style?: React.CSSProperties | undefined;
  timerDelay?: number | undefined;
  value: Uint8Array;
}

interface FrameState {
  frames: Uint8Array[];
  frameIdx: number;
  image: string | null;
  valueHash: string | null;
}

interface TimerState {
  timerDelay: number;
  timerId: ReturnType<typeof setTimeout> | null;
}

const DEFAULT_FRAME_DELAY = 2750;
const TIMER_INC = 500;

const getDataUrl = (value: Uint8Array): string => {
  const qr = qrcode(0, 'M');

  // HACK See our qrcode stringToBytes override as used internally. This
  // will only work for the case where we actually pass `Bytes` in here
  qr.addData(value as unknown as string, 'Byte');
  qr.make();

  return qr.createDataURL(16, 0);
};

const Display = ({
  className = '',
  size,
  skipEncoding,
  style = {},
  timerDelay = DEFAULT_FRAME_DELAY,
  value,
}: Props): React.ReactElement<Props> | null => {
  const [{ image }, setFrameState] = useState<FrameState>({
    frameIdx: 0,
    frames: [],
    image: null,
    valueHash: null,
  });
  const timerRef = useRef<TimerState>({ timerDelay, timerId: null });

  const containerStyle = useMemo(() => createImgSize(size), [size]);

  // run on initial load to setup the global timer and provide and unsubscribe
  useEffect((): (() => void) => {
    const nextFrame = () =>
      setFrameState((state): FrameState => {
        // when we have a single frame, we only ever fire once
        if (state.frames.length <= 1) {
          return state;
        }

        let frameIdx = state.frameIdx + 1;

        // when we overflow, skip to the first and slightly increase the delay between frames
        if (frameIdx === state.frames.length) {
          frameIdx = 0;
          timerRef.current.timerDelay += TIMER_INC;
        }

        // only encode the frames on demand, not above as part of the
        // state derivation - in the case of large payloads, this should
        // be slightly more responsive on initial load
        const newState = objectSpread<FrameState>({}, state, {
          frameIdx,
          image: getDataUrl(state.frames[frameIdx]),
        });

        // set the new timer last
        timerRef.current.timerId = setTimeout(
          nextFrame,
          timerRef.current.timerDelay
        );

        return newState;
      });

    timerRef.current.timerId = setTimeout(
      nextFrame,
      timerRef.current.timerDelay
    );

    return () => {
      if (timerRef.current.timerId) clearTimeout(timerRef.current.timerId);
    };
  }, []);

  useEffect((): void => {
    setFrameState((state): FrameState => {
      const valueHash = xxhashAsHex(value);

      if (valueHash === state.valueHash) {
        return state;
      }

      const frames: Uint8Array[] = skipEncoding ? [value] : createFrames(value);

      // encode on demand
      return {
        frameIdx: 0,
        frames,
        image: getDataUrl(frames[0]),
        valueHash,
      };
    });
  }, [skipEncoding, value]);

  if (!image) {
    return null;
  }

  return (
    <StyledDiv className={className} style={containerStyle}>
      <div className="ui--qr-Display" style={style}>
        <img src={image} alt="img" />
      </div>
    </StyledDiv>
  );
};

const StyledDiv = styled.div`
  .ui--qr-Display {
    height: 100%;
    width: 100%;

    img,
    svg {
      background: white;
      height: auto !important;
      max-height: 100%;
      max-width: 100%;
      width: auto !important;
    }
  }
`;

export const QrDisplay = React.memo(Display);
