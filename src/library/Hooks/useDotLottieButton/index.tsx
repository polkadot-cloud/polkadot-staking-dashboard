// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'contexts/Themes';
import type { Theme } from 'contexts/Themes/types';
import type { AnyJson } from 'types';

export const useDotLottieButton = (filename: string, options: AnyJson = {}) => {
  const { mode } = useTheme();

  const refLight = useRef<AnyJson>(null);
  const refDark = useRef<AnyJson>(null);
  const refsInitialised = useRef<boolean>(false);

  const getRef = (m: Theme) =>
    m === 'light' ? refLight.current : refDark.current;

  const handlePlayAnimation = async () => {
    if (!getRef(mode)) {
      return;
    }
    getRef(mode).play();
  };

  const handleComplete = (r: AnyJson) => {
    if (options?.autoLoop !== true) {
      r?.stop();
    }
  };
  useEffect(() => {
    if (!getRef('light') || !getRef('dark') || refsInitialised.current) {
      return;
    }
    refsInitialised.current = true;

    getRef('light').addEventListener('loop', () =>
      handleComplete(getRef('light'))
    );
    getRef('dark').addEventListener('loop', () =>
      handleComplete(getRef('dark'))
    );
  }, [getRef('light'), getRef('dark'), refsInitialised.current]);

  useEffect(() => {
    refsInitialised.current = false;
  }, [options?.deps]);

  const autoPlay = options?.autoLoop ?? undefined;

  const [iconLight] = useState<ReactNode>(
    <dotlottie-player
      ref={refLight}
      loop
      autoPlay={autoPlay}
      src={`${import.meta.env.BASE_URL}lottie/${filename}-light.lottie`}
      style={{ height: 'inherit', width: 'inherit' }}
    />
  );

  const [iconDark] = useState<ReactNode>(
    <dotlottie-player
      ref={refDark}
      loop
      autoPlay={autoPlay}
      src={`${import.meta.env.BASE_URL}lottie/${filename}-dark.lottie`}
      style={{ height: 'inherit', width: 'inherit' }}
    />
  );

  const icon = (
    <>
      <button
        type="button"
        style={{
          ...options?.style,
          display: mode === 'light' ? 'block' : 'none',
          height: 'inherit',
          width: 'inherit',
        }}
        onClick={() => handlePlayAnimation()}
      >
        {iconLight}
      </button>
      <button
        type="button"
        style={{
          ...options?.style,
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
