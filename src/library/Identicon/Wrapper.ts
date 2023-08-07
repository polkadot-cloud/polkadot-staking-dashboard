// Copyright 2023 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import styled from 'styled-components';

export const Wrapper = styled.div<{
  $clickToCopy?: boolean;
}>`
  svg > circle:first-child {
    fill: var(--border-primary-color);
  }

  .copy {
    cursor: ${(props) => (!props.$clickToCopy ? 'copy' : 'default')};
  }
`;
