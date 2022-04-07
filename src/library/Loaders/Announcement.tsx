// Copyright 2022 @rossbulat/polkadot-staking-experience authors & contributors
// SPDX-License-Identifier: Apache-2.0

import ContentLoader from 'react-content-loader';

export const Announcement = () => {

  return (
    <ContentLoader
      height={90}
      width='100%'
      backgroundColor="#e1e1e1"
      foregroundColor="#dadada"
      opacity={0.6}
    >
      <rect x="0" y="0" rx="0.5rem" ry="0.5rem" width="100%" height="100%" />
    </ContentLoader>
  )
}

export default Announcement