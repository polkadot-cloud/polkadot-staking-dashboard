// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTheme } from 'contexts/Themes';
import ContentLoader from 'react-content-loader';
import { defaultThemes } from 'theme/default';

export const Announcement = () => {
  const { mode } = useTheme();

  return (
    <ContentLoader
      height={60}
      width="100%"
      backgroundColor={defaultThemes.loader.background[mode]}
      foregroundColor={defaultThemes.loader.foreground[mode]}
      opacity={0.2}
      style={{ marginTop: '0.75rem', marginBottom: '0.75rem' }}
    >
      <rect x="0" y="0" rx="0.5em" ry="0.5em" width="100%" height="100%" />
    </ContentLoader>
  );
};
