// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTheme } from 'contexts/Themes';
import type { Theme } from 'contexts/Themes/types';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyJson } from 'types';

export const useDotLottieButton = (
  filename: string,
  style: React.CSSProperties = {}
) => {
  const { mode } = useTheme();

  const refLight = useRef<AnyJson>(null);
  const refDark = useRef<AnyJson>(null);
  const refsInitialised = useRef<AnyJson>(false);

  const getRef = (m: Theme) => {
    return m === 'light' ? refLight.current : refDark.current;
  };

  const handlePlayAnimation = async () => {
    if (!getRef(mode)) return;
    getRef(mode).play();
  };

  const handleComplete = (r: AnyJson) => {
    r?.stop();
  };
  useEffect(() => {
    if (!getRef('light') || !getRef('dark') || refsInitialised.current) return;
    refsInitialised.current = true;

    getRef('light').addEventListener('loop', () =>
      handleComplete(getRef('light'))
    );
    getRef('dark').addEventListener('loop', () =>
      handleComplete(getRef('dark'))
    );
  }, [getRef('light'), getRef('dark')]);

  const [iconLight] = useState<any>(
    <dotlottie-player
      ref={refLight}
      loop
      src={`/lottie/${filename}-light.lottie`}
      style={{ height: '100%', width: '100%' }}
    />
  );

  const [iconDark] = useState<any>(
    <dotlottie-player
      ref={refDark}
      loop
      src={`/lottie/${filename}-dark.lottie`}
      style={{ height: '100%', width: '100%' }}
    />
  );

  const icon = (
    <>
      <button
        type="button"
        style={{
          ...style,
          display: mode === 'light' ? 'block' : 'none',
          height: 'inherit',
          width: 'inherit',
        }}
        onClick={() => {
          handlePlayAnimation();
        }}
      >
        {iconLight}
      </button>
      <button
        type="button"
        style={{
          ...style,
          display: mode === 'dark' ? 'block' : 'none',
          height: 'inherit',
          width: 'inherit',
        }}
        onClick={() => {
          handlePlayAnimation();
        }}
      >
        {iconDark}
      </button>
    </>
  );

  return { icon, play: handlePlayAnimation };
};
