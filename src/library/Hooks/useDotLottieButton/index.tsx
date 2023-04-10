// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTheme } from 'contexts/Themes';
import type { Theme } from 'contexts/Themes/types';
import React, { useEffect, useRef, useState } from 'react';
import type { AnyJson } from 'types';

export const useDotLottieButton = (
  filename: string,
  onClick: () => void,
  style: React.CSSProperties = {}
) => {
  const { mode } = useTheme();

  const refLight = useRef<AnyJson>(null);
  const refDark = useRef<AnyJson>(null);
  const refsInitialised = useRef<AnyJson>(false);

  const getRef = (m: Theme) => {
    return m === 'light' ? refLight.current : refDark.current;
  };

  const handleOnHover = async (m: Theme) => {
    if (!getRef(m)) return;
    getRef(m).play();
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

    return () => {
      refLight.current.removeEventListener('loop', handleComplete);
      refDark.current.removeEventListener('loop', handleComplete);
    };
  }, [getRef('light'), getRef('dark')]);

  const [iconLight] = useState<any>(
    <dotlottie-player
      ref={refLight}
      loop
      autoplay
      src={`/lottie/${filename}-light.lottie`}
      style={{ height: '100%', width: '100%' }}
    />
  );

  const [iconDark] = useState<any>(
    <dotlottie-player
      ref={refDark}
      loop
      autoplay
      src={`/lottie/${filename}-dark.lottie`}
      style={{ height: '100%', width: '100%' }}
    />
  );

  return (
    <>
      <button
        type="button"
        onMouseEnter={() => handleOnHover(mode)}
        style={{ ...style, display: mode === 'light' ? 'block' : 'none' }}
        onClick={() => onClick()}
      >
        {iconLight}
      </button>
      <button
        type="button"
        onMouseEnter={() => handleOnHover(mode)}
        style={{ ...style, display: mode === 'dark' ? 'block' : 'none' }}
        onClick={() => onClick()}
      >
        {iconDark}
      </button>
    </>
  );
};
