// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef, useEffect } from 'react';
import { usePalette } from 'contexts/Palette';
import { useOutsideAlerter } from 'library/Hooks';
import { useTheme } from 'contexts/Themes';
import { ReactComponent as MoonOutlineSVG } from 'img/moon-outline.svg';
import { ReactComponent as SunnyOutlineSVG } from 'img/sunny-outline.svg';
import { Wrapper, ItemWrapper } from './Wrappers';

export const Palette = () => {
  const { mode, toggleTheme } = useTheme();
  const palette = usePalette();
  const { position } = palette;

  const ref = useRef(null);

  useEffect(() => {
    if (palette.open === 1) {
      palette.checkPalettePosition(ref);
      // check position
    }
  }, [palette.open]);

  useEffect(() => {
    window.addEventListener('resize', resizeCallback);
    return () => {
      window.removeEventListener('resize', resizeCallback);
    };
  }, []);

  const resizeCallback = () => {
    palette.closePalette();
  };

  useOutsideAlerter(
    ref,
    () => {
      palette.closePalette();
    },
    ['ignore-open-palette-button']
  );

  return (
    <>
      {palette.open === 1 && (
        <Wrapper
          ref={ref}
          style={{
            position: 'absolute',
            left: `${position[0]}px`,
            top: `${position[1]}px`,
            zIndex: 99,
            opacity: palette.show === 1 ? 1 : 0,
          }}
        >
          <h4>Theme</h4>
          <ItemWrapper>
            <button
              type="button"
              onClick={() => toggleTheme()}
              disabled={mode === 'light'}
            >
              <SunnyOutlineSVG width="1.65rem" height="1.65rem" />
            </button>
            <button
              type="button"
              onClick={() => toggleTheme()}
              disabled={mode === 'dark'}
            >
              <MoonOutlineSVG width="1.25rem" height="1.25rem" />
            </button>
          </ItemWrapper>
        </Wrapper>
      )}
    </>
  );
};

export default Palette;
