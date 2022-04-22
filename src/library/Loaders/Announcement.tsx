// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import ContentLoader from 'react-content-loader';
import { useTheme } from '../../contexts/Themes';
import { defaultThemes } from '../../theme/default';

export const Announcement = () => {

  const { mode } = useTheme();

  return (
    <ContentLoader
      height={90}
      width='100%'
      backgroundColor={defaultThemes.loader.background[mode]}
      foregroundColor={defaultThemes.loader.foreground[mode]}
      opacity={0.2}
    >
      <rect x="0" y="0" rx="0.5rem" ry="0.5rem" width="100%" height="100%" />
    </ContentLoader>
  )
}

export default Announcement